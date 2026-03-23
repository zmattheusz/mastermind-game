package com.itau.mastermind.dto;

public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private Integer bestScore;
    private Integer streakDays;
    private String lastStreakDate;
    private boolean streakWonToday;

    public UserResponse() {
    }

    public UserResponse(Long id, String username, String email, Integer bestScore) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.bestScore = bestScore != null ? bestScore : 0;
    }

    public UserResponse(Long id, String username, String email, Integer bestScore, Integer streakDays, String lastStreakDate,
                        boolean streakWonToday) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.bestScore = bestScore != null ? bestScore : 0;
        this.streakDays = streakDays != null ? streakDays : 0;
        this.lastStreakDate = lastStreakDate;
        this.streakWonToday = streakWonToday;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getBestScore() {
        return bestScore;
    }

    public void setBestScore(Integer bestScore) {
        this.bestScore = bestScore;
    }

    public Integer getStreakDays() {
        return streakDays;
    }

    public void setStreakDays(Integer streakDays) {
        this.streakDays = streakDays;
    }

    public String getLastStreakDate() {
        return lastStreakDate;
    }

    public void setLastStreakDate(String lastStreakDate) {
        this.lastStreakDate = lastStreakDate;
    }

    public boolean isStreakWonToday() {
        return streakWonToday;
    }

    public void setStreakWonToday(boolean streakWonToday) {
        this.streakWonToday = streakWonToday;
    }
}
