package com.itau.mastermind.dto;

public class LoginResponse {

    private String token;
    private String type = "Bearer";
    private UserResponse user;

    public LoginResponse(String token, UserResponse user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public String getType() {
        return type;
    }

    public UserResponse getUser() {
        return user;
    }
}
