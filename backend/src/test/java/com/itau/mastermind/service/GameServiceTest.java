package com.itau.mastermind.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itau.mastermind.domain.Game;
import com.itau.mastermind.domain.User;
import com.itau.mastermind.dto.AttemptRequest;
import com.itau.mastermind.dto.AttemptResponse;
import com.itau.mastermind.dto.GameStartResponse;
import com.itau.mastermind.exception.BadRequestException;
import com.itau.mastermind.exception.NotFoundException;
import com.itau.mastermind.repository.GameRepository;
import com.itau.mastermind.repository.UserRepository;
import com.itau.mastermind.security.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GameServiceTest {

    @Mock
    private GameRepository gameRepository;

    @Mock
    private UserRepository userRepository;

    private GameService gameService;
    private UserDetailsImpl userDetails;
    private User user;

    @BeforeEach
    void setUp() {
        gameService = new GameService(gameRepository, userRepository, new ObjectMapper());
        ReflectionTestUtils.setField(gameService, "maxAttempts", 10);

        user = new User("player1", "p@t.com", "pass");
        user.setId(1L);
        userDetails = new UserDetailsImpl(user);
    }

    @Test
    void startGame_shouldReturnGameCode() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(gameRepository.findByGameCode(anyString())).thenReturn(Optional.empty());
        when(gameRepository.save(any(Game.class))).thenAnswer(inv -> {
            Game g = inv.getArgument(0);
            g.setId(1L);
            return g;
        });

        GameStartResponse response = gameService.startGame(userDetails);

        assertNotNull(response.getGameCode());
        assertTrue(response.getGameCode().length() <= 12);
        verify(gameRepository).save(any(Game.class));
    }

    @Test
    void submitAttempt_whenCorrect_shouldReturnWon() {
        Game game = new Game();
        game.setId(1L);
        game.setGameCode("abc123");
        game.setUser(user);
        game.setExpectedCode("R,G,B,Y");
        game.setAttemptsMatrix("[]");
        game.setAttemptCount(0);
        game.setStatus(Game.GameStatus.IN_PROGRESS);
        game.setStartedAt(Instant.now().minusSeconds(30));

        when(gameRepository.findByGameCode("abc123")).thenReturn(Optional.of(game));
        when(gameRepository.save(any(Game.class))).thenReturn(game);
        when(userRepository.save(any(User.class))).thenReturn(user);

        AttemptRequest request = new AttemptRequest();
        request.setGuess(List.of("R", "G", "B", "Y"));

        AttemptResponse response = gameService.submitAttempt("abc123", request, userDetails);

        assertEquals(4, response.getCorrectCount());
        assertTrue(response.isWon());
        assertTrue(response.isGameOver());
        verify(gameRepository).save(any(Game.class));
    }

    @Test
    void submitAttempt_shouldThrowWhenGameNotFound() {
        when(gameRepository.findByGameCode("invalid")).thenReturn(Optional.empty());
        AttemptRequest request = new AttemptRequest();
        request.setGuess(List.of("R", "G", "B", "Y"));

        assertThrows(NotFoundException.class,
                () -> gameService.submitAttempt("invalid", request, userDetails));
    }

    @Test
    void submitAttempt_shouldThrowWhenGameFinished() {
        Game game = new Game();
        game.setGameCode("abc123");
        game.setUser(user);
        game.setStatus(Game.GameStatus.WON);
        when(gameRepository.findByGameCode("abc123")).thenReturn(Optional.of(game));

        AttemptRequest request = new AttemptRequest();
        request.setGuess(List.of("R", "G", "B", "Y"));

        assertThrows(BadRequestException.class,
                () -> gameService.submitAttempt("abc123", request, userDetails));
    }
}
