package com.itau.mastermind.dto;

import java.util.List;

public class DifficultyInfoResponse {

    private String difficulty;
    private String title;
    private String description;
    private int codeLength;
    private List<String> allowedColors;
    private boolean repetitionsAllowed;
    private int maxAttempts;

    public DifficultyInfoResponse() {
    }

    public DifficultyInfoResponse(String difficulty, String title, String description, int codeLength,
                                    List<String> allowedColors, boolean repetitionsAllowed, int maxAttempts) {
        this.difficulty = difficulty;
        this.title = title;
        this.description = description;
        this.codeLength = codeLength;
        this.allowedColors = allowedColors;
        this.repetitionsAllowed = repetitionsAllowed;
        this.maxAttempts = maxAttempts;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getCodeLength() {
        return codeLength;
    }

    public void setCodeLength(int codeLength) {
        this.codeLength = codeLength;
    }

    public List<String> getAllowedColors() {
        return allowedColors;
    }

    public void setAllowedColors(List<String> allowedColors) {
        this.allowedColors = allowedColors;
    }

    public boolean isRepetitionsAllowed() {
        return repetitionsAllowed;
    }

    public void setRepetitionsAllowed(boolean repetitionsAllowed) {
        this.repetitionsAllowed = repetitionsAllowed;
    }

    public int getMaxAttempts() {
        return maxAttempts;
    }

    public void setMaxAttempts(int maxAttempts) {
        this.maxAttempts = maxAttempts;
    }
}

