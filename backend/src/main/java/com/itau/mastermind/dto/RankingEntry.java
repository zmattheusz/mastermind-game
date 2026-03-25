package com.itau.mastermind.dto;

public class RankingEntry {

    private int position;
    private String username;
    private Integer bestScore;
    private Long bestScoreAt;
    private Long bestDurationSeconds;

    public RankingEntry(int position, String username, Integer bestScore, Long bestScoreAt, Long bestDurationSeconds) {
        this.position = position;
        this.username = username;
        this.bestScore = (bestScore != null && bestScore > 0 ? bestScore : null);
        this.bestScoreAt = bestScoreAt;
        this.bestDurationSeconds = bestDurationSeconds;
    }

    public int getPosition() {
        return position;
    }

    public String getUsername() {
        return username;
    }

    public Integer getBestScore() {
        return bestScore;
    }

    public Long getBestScoreAt() {
        return bestScoreAt;
    }

    public Long getBestDurationSeconds() {
        return bestDurationSeconds;
    }
}
