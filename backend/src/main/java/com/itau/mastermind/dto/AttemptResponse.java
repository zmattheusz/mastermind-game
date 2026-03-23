package com.itau.mastermind.dto;

public class AttemptResponse {

    private int correctCount;
    private boolean won;
    private boolean gameOver;
    private int attemptNumber;

    public AttemptResponse(int correctCount, boolean won, boolean gameOver, int attemptNumber) {
        this.correctCount = correctCount;
        this.won = won;
        this.gameOver = gameOver;
        this.attemptNumber = attemptNumber;
    }

    public int getCorrectCount() {
        return correctCount;
    }

    public boolean isWon() {
        return won;
    }

    public boolean isGameOver() {
        return gameOver;
    }

    public int getAttemptNumber() {
        return attemptNumber;
    }
}
