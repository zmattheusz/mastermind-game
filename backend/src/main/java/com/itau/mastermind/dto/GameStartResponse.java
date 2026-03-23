package com.itau.mastermind.dto;

public class GameStartResponse {

    private String gameCode;

    public GameStartResponse(String gameCode) {
        this.gameCode = gameCode;
    }

    public String getGameCode() {
        return gameCode;
    }

    public void setGameCode(String gameCode) {
        this.gameCode = gameCode;
    }
}
