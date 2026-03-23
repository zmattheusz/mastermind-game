package com.itau.mastermind.dto;

public class RankingEntry {

    private int position;
    private String username;
    private Integer bestScore;
    private Long bestScoreAt;

    public RankingEntry(int position, String username, Integer bestScore, Long bestScoreAt) {
        this.position = position;
        this.username = username;
        this.bestScore = (bestScore != null && bestScore > 0 ? bestScore : null);
        this.bestScoreAt = bestScoreAt;
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
}
