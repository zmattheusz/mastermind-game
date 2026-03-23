package com.itau.mastermind.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LoginRequest {

    @NotBlank(message = "Usuário (e-mail ou nome) é obrigatório")
    private String usernameOrEmail;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, max = 16, message = "Senha deve ter entre 6 e 16 caracteres")
    private String password;

    public String getUsernameOrEmail() {
        return usernameOrEmail;
    }

    public void setUsernameOrEmail(String usernameOrEmail) {
        this.usernameOrEmail = usernameOrEmail;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
