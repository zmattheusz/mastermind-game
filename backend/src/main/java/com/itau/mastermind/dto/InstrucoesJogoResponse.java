package com.itau.mastermind.dto;

import java.util.List;

public class InstrucoesJogoResponse {

    private List<String> steps;
    private List<DifficultyInfoResponse> difficulties;

    public InstrucoesJogoResponse(List<String> steps) {
        this.steps = steps;
    }

    public InstrucoesJogoResponse(List<String> steps, List<DifficultyInfoResponse> difficulties) {
        this.steps = steps;
        this.difficulties = difficulties;
    }

    public List<String> getSteps() {
        return steps;
    }

    public void setSteps(List<String> steps) {
        this.steps = steps;
    }

    public List<DifficultyInfoResponse> getDifficulties() {
        return difficulties;
    }

    public void setDifficulties(List<DifficultyInfoResponse> difficulties) {
        this.difficulties = difficulties;
    }
}
