package com.itau.mastermind.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itau.mastermind.dto.LoginRequest;
import com.itau.mastermind.dto.LoginResponse;
import com.itau.mastermind.dto.RegisterRequest;
import com.itau.mastermind.dto.ResetPasswordRequest;
import com.itau.mastermind.dto.UserResponse;
import com.itau.mastermind.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import com.itau.mastermind.security.JwtUtil;
import com.itau.mastermind.security.UserDetailsServiceImpl;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.mockito.Mockito.doNothing;

@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @Test
    void login_shouldReturn200AndToken() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsernameOrEmail("player1");
        request.setPassword("senha123");
        UserResponse userResp = new UserResponse(1L, "player1", "p@t.com", 0);
        when(authService.login(any(LoginRequest.class))).thenReturn(new LoginResponse("jwt", userResp));

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt"))
                .andExpect(jsonPath("$.user.username").value("player1"));
    }

    @Test
    void login_shouldReturn400WhenEmptyFields() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"usernameOrEmail\":\"\",\"password\":\"\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_shouldReturn201() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setEmail("new@test.com");
        request.setPassword("senha123");
        request.setSecurityAnswer("rex");
        UserResponse userResp = new UserResponse(1L, "newuser", "new@test.com", 0);
        when(authService.register(any(RegisterRequest.class))).thenReturn(userResp);

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("newuser"));
    }

    @Test
    void resetPassword_shouldReturn204() throws Exception {
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setEmail("u@test.com");
        request.setSecurityAnswer("rex");
        request.setNewPassword("senha123");
        doNothing().when(authService).resetPassword(any(ResetPasswordRequest.class));

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNoContent());
    }
}
