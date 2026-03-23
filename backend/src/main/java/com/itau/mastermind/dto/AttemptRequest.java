package com.itau.mastermind.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class AttemptRequest {

    @NotEmpty(message = "A tentativa deve conter cores")
    private List<String> guess;

    public List<String> getGuess() {
        return guess;
    }

    public void setGuess(List<String> guess) {
        this.guess = guess;
    }
}
