package com.itau.mastermind.dto;

import java.util.List;

public class GameStatusResponse {

    private String gameCode;
    private String status;
    private String difficulty;
    private int codeLength;
    private boolean repetitionsAllowed;
    private List<String> allowedColors;
    private int attemptCount;
    private Integer finalScore;
    private Long durationSeconds;
    private Long startedAtEpochMs;
    private List<List<String>> attemptsMatrix;
    private List<Integer> feedbackCounts;
    private List<String> answer;

    public String getGameCode() {
        return gameCode;
    }

    public void setGameCode(String gameCode) {
        this.gameCode = gameCode;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public int getCodeLength() {
        return codeLength;
    }

    public void setCodeLength(int codeLength) {
        this.codeLength = codeLength;
    }

    public boolean isRepetitionsAllowed() {
        return repetitionsAllowed;
    }

    public void setRepetitionsAllowed(boolean repetitionsAllowed) {
        this.repetitionsAllowed = repetitionsAllowed;
    }

    public List<String> getAllowedColors() {
        return allowedColors;
    }

    public void setAllowedColors(List<String> allowedColors) {
        this.allowedColors = allowedColors;
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

    public Long getStartedAtEpochMs() {
        return startedAtEpochMs;
    }

    public void setStartedAtEpochMs(Long startedAtEpochMs) {
        this.startedAtEpochMs = startedAtEpochMs;
    }

    public List<List<String>> getAttemptsMatrix() {
        return attemptsMatrix;
    }

    public void setAttemptsMatrix(List<List<String>> attemptsMatrix) {
        this.attemptsMatrix = attemptsMatrix;
    }

    public List<Integer> getFeedbackCounts() {
        return feedbackCounts;
    }

    public void setFeedbackCounts(List<Integer> feedbackCounts) {
        this.feedbackCounts = feedbackCounts;
    }

    public List<String> getAnswer() {
        return answer;
    }

    public void setAnswer(List<String> answer) {
        this.answer = answer;
    }
}
