package com.itau.mastermind.controller;

import com.itau.mastermind.dto.*;
import com.itau.mastermind.domain.Game;
import com.itau.mastermind.security.UserDetailsImpl;
import com.itau.mastermind.service.GameService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Jogo", description = "Iniciar partida, enviar tentativas e consultar status")
@RestController
@RequestMapping("/games")
@SecurityRequirement(name = "bearerAuth")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @Operation(summary = "Iniciar nova partida")
    @PostMapping("/start")
    public ResponseEntity<GameStartResponse> startGame(@AuthenticationPrincipal UserDetailsImpl user) {
        GameStartResponse response = gameService.startGame(user);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Iniciar nova partida com dificuldade")
    @PostMapping("/start/{difficulty}")
    public ResponseEntity<GameStartResponse> startGameWithDifficulty(
            @PathVariable String difficulty,
            @AuthenticationPrincipal UserDetailsImpl user) {
        GameStartResponse response = gameService.startGame(user, Game.GameDifficulty.valueOf(difficulty.toUpperCase()));
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Enviar tentativa")
    @PostMapping("/{gameCode}/attempt")
    public ResponseEntity<AttemptResponse> submitAttempt(
            @PathVariable String gameCode,
            @Valid @RequestBody AttemptRequest request,
            @AuthenticationPrincipal UserDetailsImpl user) {
        AttemptResponse response = gameService.submitAttempt(gameCode, request, user);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Instruções do Mastermind e resumo das dificuldades")
    @GetMapping("/instrucoes")
    public ResponseEntity<InstrucoesJogoResponse> instrucoesJogo() {
        return ResponseEntity.ok(gameService.obterInstrucoesJogo());
    }

    @Operation(summary = "Consultar status da partida")
    @GetMapping("/{gameCode}")
    public ResponseEntity<GameStatusResponse> getGameStatus(
            @PathVariable String gameCode,
            @AuthenticationPrincipal UserDetailsImpl user) {
        GameStatusResponse response = gameService.getGameStatus(gameCode, user);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Ranking de jogadores")
    @GetMapping("/ranking")
    public ResponseEntity<List<RankingEntry>> getRanking(
            @RequestParam(name = "difficulty", defaultValue = "MEDIUM") String difficulty) {
        Game.GameDifficulty diff = Game.GameDifficulty.valueOf(difficulty.toUpperCase());
        List<RankingEntry> ranking = gameService.getRanking(diff);
        return ResponseEntity.ok(ranking);
    }

    @Operation(summary = "Configurações e descrições das dificuldades")
    @GetMapping("/difficulties")
    public ResponseEntity<List<DifficultyInfoResponse>> getDifficulties() {
        return ResponseEntity.ok(gameService.getDifficulties());
    }

    @Operation(summary = "Desistir da partida e exibir o gabarito")
    @PostMapping("/{gameCode}/forfeit")
    public ResponseEntity<GameStatusResponse> forfeit(
            @PathVariable String gameCode,
            @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(gameService.forfeitGame(gameCode, user));
    }
}
