package com.itau.mastermind.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itau.mastermind.domain.Game;
import com.itau.mastermind.domain.User;
import com.itau.mastermind.dto.*;
import com.itau.mastermind.exception.BadRequestException;
import com.itau.mastermind.exception.NotFoundException;
import com.itau.mastermind.repository.GameRepository;
import com.itau.mastermind.repository.UserRepository;
import com.itau.mastermind.security.UserDetailsImpl;
import com.itau.mastermind.util.FusoHorarioPadrao;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GameService {

    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Value("${app.mastermind.max-attempts:10}")
    private int maxAttempts;

    private record ParametrosDificuldade(int codeLength, List<String> allowedColors, boolean repetitionsAllowed) {}

    private ParametrosDificuldade parametrosDaDificuldade(Game.GameDifficulty difficulty) {
        if (difficulty == Game.GameDifficulty.EASY) {
            return new ParametrosDificuldade(
                    4,
                    List.of("R", "G", "B", "Y", "O", "P"),
                    false
            );
        }

        if (difficulty == Game.GameDifficulty.MEDIUM) {
            return new ParametrosDificuldade(
                    4,
                    List.of("R", "G", "B", "Y", "O", "P"),
                    true
            );
        }

        return new ParametrosDificuldade(
                5,
                List.of("R", "G", "B", "Y", "O", "P", "C", "M"),
                true
        );
    }

    public GameService(GameRepository gameRepository, UserRepository userRepository, ObjectMapper objectMapper) {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    private String generateSecretCode(ParametrosDificuldade cfg) {
        Random r = new Random();

        if (!cfg.repetitionsAllowed()) {
            List<String> colors = new ArrayList<>(cfg.allowedColors());
            if (colors.size() < cfg.codeLength()) {
                throw new IllegalStateException("Quantidade de cores configuradas é menor que o tamanho do código.");
            }
            Collections.shuffle(colors);
            return String.join(",", colors.subList(0, cfg.codeLength()));
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < cfg.codeLength(); i++) {
            sb.append(cfg.allowedColors().get(r.nextInt(cfg.allowedColors().size())));
            if (i < cfg.codeLength() - 1) sb.append(",");
        }
        return sb.toString();
    }

    private String generateGameCode() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }

    @Transactional
    public GameStartResponse startGame(UserDetailsImpl currentUser) {
        return startGame(currentUser, Game.GameDifficulty.MEDIUM);
    }

    @Transactional
    public GameStartResponse startGame(UserDetailsImpl currentUser, Game.GameDifficulty difficulty) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado."));

        String gameCode = generateGameCode();
        while (gameRepository.findByGameCode(gameCode).isPresent()) {
            gameCode = generateGameCode();
        }

        ParametrosDificuldade cfg = parametrosDaDificuldade(difficulty);

        Game game = new Game();
        game.setGameCode(gameCode);
        game.setUser(user);
        game.setDifficulty(difficulty);
        game.setExpectedCode(generateSecretCode(cfg));
        game.setAttemptsMatrix("[]");
        game.setFeedbackCounts("[]");
        game.setStartedAt(Instant.now());
        game.setStatus(Game.GameStatus.IN_PROGRESS);
        gameRepository.save(game);
        return new GameStartResponse(gameCode);
    }

    @Transactional
    public AttemptResponse submitAttempt(String gameCode, AttemptRequest request, UserDetailsImpl currentUser) {
        Game game = gameRepository.findByGameCode(gameCode)
                .orElseThrow(() -> new NotFoundException("Partida não encontrada."));
        if (game.getUser().getId() != currentUser.getId()) {
            throw new BadRequestException("Esta partida não pertence ao usuário atual.");
        }
        if (game.getStatus() != Game.GameStatus.IN_PROGRESS) {
            throw new BadRequestException("Esta partida já foi finalizada.");
        }
        Game.GameDifficulty difficulty = game.getDifficulty();
        ParametrosDificuldade cfg = parametrosDaDificuldade(difficulty);
        int codeLength = cfg.codeLength();

        List<String> allowed = cfg.allowedColors();
        List<String> guess = request.getGuess();
        if (guess.size() != codeLength) {
            throw new BadRequestException("A tentativa deve conter exatamente " + codeLength + " cores.");
        }

        if (!cfg.repetitionsAllowed()) {
            Set<String> distinct = new HashSet<>(guess);
            if (distinct.size() != codeLength) {
                throw new BadRequestException("Não é permitido repetir a mesma cor neste modo.");
            }
        }

        for (String color : guess) {
            if (!allowed.contains(color)) {
                throw new BadRequestException("Cor inválida: " + color + ". Cores permitidas: " + String.join(", ", allowed));
            }
        }

        int correctCount = countCorrect(game.getExpectedCode(), guess, codeLength);
        game.setAttemptCount(game.getAttemptCount() + 1);

        List<List<String>> matrix = parseMatrix(game.getAttemptsMatrix());
        matrix.add(new ArrayList<>(guess));
        game.setAttemptsMatrix(writeMatrix(matrix));

        List<Integer> feedbackList = parseFeedbackCounts(game.getFeedbackCounts());
        feedbackList.add(correctCount);
        game.setFeedbackCounts(writeFeedbackCounts(feedbackList));

        boolean won = correctCount == codeLength;
        boolean gameOver = won || game.getAttemptCount() >= maxAttempts;

        if (won) {
            game.setStatus(Game.GameStatus.WON);
            game.setFinalScore(game.getAttemptCount());
            Instant finishedAt = Instant.now();
            game.setFinishedAt(finishedAt);
            game.setDurationSeconds(game.getStartedAt() != null
                    ? finishedAt.getEpochSecond() - game.getStartedAt().getEpochSecond() : 0L);

            User user = game.getUser();
            int score = game.getAttemptCount();
            boolean updated = false;

            if (user.getBestScore() == null || user.getBestScore() == 0 || user.getBestScore() > score) {
                user.setBestScore(score);
                user.setBestScoreAt(finishedAt);
                updated = true;
            }

            if (difficulty == Game.GameDifficulty.EASY) {
                if (user.getBestScoreEasy() == null || user.getBestScoreEasy() == 0 || user.getBestScoreEasy() > score) {
                    user.setBestScoreEasy(score);
                    user.setBestScoreAtEasy(finishedAt);
                    updated = true;
                }
            } else if (difficulty == Game.GameDifficulty.MEDIUM) {
                if (user.getBestScoreMedium() == null || user.getBestScoreMedium() == 0 || user.getBestScoreMedium() > score) {
                    user.setBestScoreMedium(score);
                    user.setBestScoreAtMedium(finishedAt);
                    updated = true;
                }
            } else if (difficulty == Game.GameDifficulty.HARD) {
                if (user.getBestScoreHard() == null || user.getBestScoreHard() == 0 || user.getBestScoreHard() > score) {
                    user.setBestScoreHard(score);
                    user.setBestScoreAtHard(finishedAt);
                    updated = true;
                }
            }

            boolean streakChanged = applyStreak(user, finishedAt);
            if (updated || streakChanged) {
                userRepository.save(user);
            }
        } else if (game.getAttemptCount() >= maxAttempts) {
            game.setStatus(Game.GameStatus.LOST);
            Instant finishedAt = Instant.now();
            game.setFinishedAt(finishedAt);
            game.setDurationSeconds(game.getStartedAt() != null
                    ? finishedAt.getEpochSecond() - game.getStartedAt().getEpochSecond() : 0L);
        }

        gameRepository.save(game);

        return new AttemptResponse(correctCount, won, gameOver, game.getAttemptCount());
    }

    private boolean applyStreak(User user, Instant finishedAt) {
        LocalDate today = finishedAt.atZone(FusoHorarioPadrao.BRASIL).toLocalDate();
        LocalDate last = user.getLastStreakDate();
        int current = user.getStreakDays() != null ? user.getStreakDays() : 0;

        if (last == null) {
            user.setStreakDays(1);
            user.setLastStreakDate(today);
            return true;
        }
        if (last.equals(today)) {
            return false;
        }
        if (last.equals(today.minusDays(1))) {
            user.setStreakDays(current + 1);
        } else {
            user.setStreakDays(1);
        }
        user.setLastStreakDate(today);
        return true;
    }

    private int countCorrect(String expectedCode, List<String> guess, int codeLength) {
        String[] expected = expectedCode.split(",");
        int count = 0;
        for (int i = 0; i < codeLength && i < guess.size(); i++) {
            if (expected[i].trim().equals(guess.get(i))) {
                count++;
            }
        }
        return count;
    }

    private List<List<String>> parseMatrix(String json) {
        try {
            if (json == null || json.isBlank()) return new ArrayList<>();
            return objectMapper.readValue(json, new TypeReference<List<List<String>>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private String writeMatrix(List<List<String>> matrix) {
        try {
            return objectMapper.writeValueAsString(matrix);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao serializar matriz de tentativas", e);
        }
    }

    private List<Integer> parseFeedbackCounts(String json) {
        try {
            if (json == null || json.isBlank()) return new ArrayList<>();
            return objectMapper.readValue(json, new TypeReference<List<Integer>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private String writeFeedbackCounts(List<Integer> list) {
        try {
            return objectMapper.writeValueAsString(list);
        } catch (Exception e) {
            return "[]";
        }
    }

    public GameStatusResponse getGameStatus(String gameCode, UserDetailsImpl currentUser) {
        Game game = gameRepository.findByGameCode(gameCode)
                .orElseThrow(() -> new NotFoundException("Partida não encontrada."));
        if (game.getUser().getId() != currentUser.getId()) {
            throw new BadRequestException("Esta partida não pertence ao usuário atual.");
        }

        ParametrosDificuldade cfg = parametrosDaDificuldade(game.getDifficulty());

        GameStatusResponse dto = new GameStatusResponse();
        dto.setGameCode(game.getGameCode());
        dto.setStatus(game.getStatus().name());
        dto.setDifficulty(game.getDifficulty().name());
        dto.setCodeLength(cfg.codeLength());
        dto.setRepetitionsAllowed(cfg.repetitionsAllowed());
        dto.setAllowedColors(cfg.allowedColors());
        dto.setAttemptCount(game.getAttemptCount());
        dto.setFinalScore(game.getFinalScore());
        dto.setDurationSeconds(game.getDurationSeconds());
        dto.setAttemptsMatrix(parseMatrix(game.getAttemptsMatrix()));
        dto.setFeedbackCounts(parseFeedbackCounts(game.getFeedbackCounts()));
        if (game.getStatus() != Game.GameStatus.IN_PROGRESS) {
            List<String> answer = Arrays.stream(game.getExpectedCode().split(","))
                    .map(String::trim)
                    .toList();
            dto.setAnswer(answer);
        }
        return dto;
    }

    public List<RankingEntry> getRanking(Game.GameDifficulty difficulty) {
        List<User> users;
        if (difficulty == Game.GameDifficulty.EASY) {
            users = userRepository.findAllForRankingEasy();
        } else if (difficulty == Game.GameDifficulty.HARD) {
            users = userRepository.findAllForRankingHard();
        } else {
            users = userRepository.findAllForRankingMedium();
        }

        List<RankingEntry> result = new ArrayList<>();
        for (int i = 0; i < users.size(); i++) {
            User u = users.get(i);
            Integer bestScore;
            java.time.Instant bestAtInstant;

            if (difficulty == Game.GameDifficulty.EASY) {
                bestScore = u.getBestScoreEasy();
                bestAtInstant = u.getBestScoreAtEasy();
            } else if (difficulty == Game.GameDifficulty.HARD) {
                bestScore = u.getBestScoreHard();
                bestAtInstant = u.getBestScoreAtHard();
            } else {
                bestScore = u.getBestScoreMedium();
                bestAtInstant = u.getBestScoreAtMedium();
            }

            Long bestAt = bestAtInstant != null ? bestAtInstant.toEpochMilli() : null;
            result.add(new RankingEntry(i + 1, u.getUsername(), bestScore, bestAt));
        }

        return result;
    }

    public InstrucoesJogoResponse obterInstrucoesJogo() {
        List<DifficultyInfoResponse> difficulties = getDifficulties();

        List<String> steps = List.of(
                "O objetivo é descobrir a combinação secreta gerada pelo sistema (tamanho e cores variam conforme a dificuldade).",
                "Você faz tentativas escolhendo as cores nas posições solicitadas.",
                "A validação retorna apenas a quantidade de posições corretas (cor e posição certas).",
                "No modo Fácil, as cores não podem se repetir na tentativa; no modo Médio e Difícil, a repetição é permitida.",
                "Você tem no máximo " + maxAttempts + " tentativas para acertar a combinação.",
                "Ao final da partida (vitória, derrota ou desistência) o gabarito é exibido para conferência."
        );

        return new InstrucoesJogoResponse(steps, difficulties);
    }

    public List<DifficultyInfoResponse> getDifficulties() {
        List<DifficultyInfoResponse> result = new ArrayList<>();
        for (Game.GameDifficulty difficulty : List.of(Game.GameDifficulty.EASY, Game.GameDifficulty.MEDIUM, Game.GameDifficulty.HARD)) {
            ParametrosDificuldade cfg = parametrosDaDificuldade(difficulty);
            if (difficulty == Game.GameDifficulty.EASY) {
                result.add(new DifficultyInfoResponse(
                        difficulty.name(),
                        "Fácil",
                        "Para novos decodificadores: 4 posições, 6 cores e sem repetições.",
                        cfg.codeLength(),
                        cfg.allowedColors(),
                        false,
                        maxAttempts
                ));
            } else if (difficulty == Game.GameDifficulty.MEDIUM) {
                result.add(new DifficultyInfoResponse(
                        difficulty.name(),
                        "Médio",
                        "O desafio padrão do sistema: 4 posições, 6 cores e permite repetições.",
                        cfg.codeLength(),
                        cfg.allowedColors(),
                        true,
                        maxAttempts
                ));
            } else {
                result.add(new DifficultyInfoResponse(
                        difficulty.name(),
                        "Difícil",
                        "Apenas para mentes de elite: 5 posições, 8 cores e permite repetições.",
                        cfg.codeLength(),
                        cfg.allowedColors(),
                        true,
                        maxAttempts
                ));
            }
        }
        return result;
    }

    @Transactional
    public GameStatusResponse forfeitGame(String gameCode, UserDetailsImpl currentUser) {
        Game game = gameRepository.findByGameCode(gameCode)
                .orElseThrow(() -> new NotFoundException("Partida não encontrada."));

        if (game.getUser().getId() != currentUser.getId()) {
            throw new BadRequestException("Esta partida não pertence ao usuário atual.");
        }

        if (game.getStatus() != Game.GameStatus.IN_PROGRESS) {
            throw new BadRequestException("Esta partida já foi finalizada.");
        }

        game.setStatus(Game.GameStatus.LOST);
        Instant finishedAt = Instant.now();
        game.setFinishedAt(finishedAt);
        game.setDurationSeconds(game.getStartedAt() != null
                ? finishedAt.getEpochSecond() - game.getStartedAt().getEpochSecond() : 0L);
        gameRepository.save(game);

        return getGameStatus(gameCode, currentUser);
    }
}
