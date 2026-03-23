package com.itau.mastermind.service;

import com.itau.mastermind.domain.User;
import com.itau.mastermind.dto.LoginRequest;
import com.itau.mastermind.dto.LoginResponse;
import com.itau.mastermind.dto.RegisterRequest;
import com.itau.mastermind.dto.ResetPasswordRequest;
import com.itau.mastermind.exception.BadRequestException;
import com.itau.mastermind.repository.UserRepository;
import com.itau.mastermind.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_shouldCreateUser() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("player1");
        request.setEmail("p1@test.com");
        request.setPassword("senha123");
        request.setSecurityAnswer("rex");

        when(userRepository.existsByUsername("player1")).thenReturn(false);
        when(userRepository.existsByEmail("p1@test.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(1L);
            return u;
        });

        var response = authService.register(request);

        assertNotNull(response);
        assertEquals("player1", response.getUsername());
        assertEquals("p1@test.com", response.getEmail());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_shouldThrowWhenUsernameExists() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("player1");
        request.setEmail("p1@test.com");
        request.setPassword("senha123");
        request.setSecurityAnswer("rex");
        when(userRepository.existsByUsername("player1")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_shouldReturnTokenAndUser() {
        LoginRequest request = new LoginRequest();
        request.setUsernameOrEmail("player1");
        request.setPassword("senha123");

        User user = new User("player1", "p1@test.com", "encoded");
        user.setId(1L);
        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(auth.getPrincipal()).thenReturn(new com.itau.mastermind.security.UserDetailsImpl(user));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken("player1")).thenReturn("jwt-token");

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals("player1", response.getUser().getUsername());
    }

    @Test
    void login_shouldThrowWhenBadCredentials() {
        LoginRequest request = new LoginRequest();
        request.setUsernameOrEmail("x");
        request.setPassword("wrong");
        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("bad"));

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
    }

    @Test
    void resetPassword_shouldUpdateWhenAnswerMatches() {
        ResetPasswordRequest req = new ResetPasswordRequest();
        req.setEmail("u@test.com");
        req.setSecurityAnswer(" Rex ");
        req.setNewPassword("newpass12");

        User user = new User("u", "u@test.com", "oldhash");
        user.setId(1L);
        user.setSecurityAnswerHash("sec-hash");

        when(userRepository.findByEmail("u@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("rex", "sec-hash")).thenReturn(true);
        when(passwordEncoder.encode("newpass12")).thenReturn("new-hash");

        authService.resetPassword(req);

        verify(userRepository).save(argThat(u -> "new-hash".equals(u.getPassword())));
    }

    @Test
    void resetPassword_shouldThrowWhenAnswerWrong() {
        ResetPasswordRequest req = new ResetPasswordRequest();
        req.setEmail("u@test.com");
        req.setSecurityAnswer("wrong");
        req.setNewPassword("newpass12");

        User user = new User("u", "u@test.com", "oldhash");
        user.setSecurityAnswerHash("sec-hash");

        when(userRepository.findByEmail("u@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "sec-hash")).thenReturn(false);

        assertThrows(BadRequestException.class, () -> authService.resetPassword(req));
        verify(userRepository, never()).save(any());
    }
}
