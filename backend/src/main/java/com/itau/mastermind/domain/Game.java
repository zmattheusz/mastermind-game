package com.itau.mastermind.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "games")
public class Game {

    public enum GameDifficulty {
        EASY,
        MEDIUM,
        HARD
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String gameCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String expectedCode;

    @Column(columnDefinition = "CLOB")
    private String attemptsMatrix;

    @Column(columnDefinition = "VARCHAR(100)")
    private String feedbackCounts;

    private int attemptCount = 0;

    private Integer finalScore;

    private Long durationSeconds;

    @Column(nullable = false)
    private Instant startedAt;

    private Instant finishedAt;

    @Enumerated(EnumType.STRING)
    private GameStatus status = GameStatus.IN_PROGRESS;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GameDifficulty difficulty = GameDifficulty.MEDIUM;

    public enum GameStatus {
        IN_PROGRESS,
        WON,
        LOST
    }

    public Game() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGameCode() {
        return gameCode;
    }

    public void setGameCode(String gameCode) {
        this.gameCode = gameCode;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getExpectedCode() {
        return expectedCode;
    }

    public void setExpectedCode(String expectedCode) {
        this.expectedCode = expectedCode;
    }

    public String getAttemptsMatrix() {
        return attemptsMatrix;
    }

    public void setAttemptsMatrix(String attemptsMatrix) {
        this.attemptsMatrix = attemptsMatrix;
    }

    public String getFeedbackCounts() {
        return feedbackCounts;
    }

    public void setFeedbackCounts(String feedbackCounts) {
        this.feedbackCounts = feedbackCounts;
    }

    public int getAttemptCount() {
        return attemptCount;
    }

    public void setAttemptCount(int attemptCount) {
        this.attemptCount = attemptCount;
    }

    public Integer getFinalScore() {
        return finalScore;
    }

    public void setFinalScore(Integer finalScore) {
        this.finalScore = finalScore;
    }

    public Long getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(Long durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public Instant getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(Instant startedAt) {
        this.startedAt = startedAt;
    }

    public Instant getFinishedAt() {
        return finishedAt;
    }

    public void setFinishedAt(Instant finishedAt) {
        this.finishedAt = finishedAt;
    }

    public GameStatus getStatus() {
        return status;
    }

    public void setStatus(GameStatus status) {
        this.status = status;
    }

    public GameDifficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(GameDifficulty difficulty) {
        this.difficulty = difficulty;
    }
}
