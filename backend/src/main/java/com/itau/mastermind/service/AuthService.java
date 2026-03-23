package com.itau.mastermind.service;

import com.itau.mastermind.domain.User;
import com.itau.mastermind.dto.*;
import com.itau.mastermind.exception.BadRequestException;
import com.itau.mastermind.exception.NotFoundException;
import com.itau.mastermind.exception.UnauthorizedException;
import com.itau.mastermind.repository.UserRepository;
import com.itau.mastermind.security.JwtUtil;
import com.itau.mastermind.security.UserDetailsImpl;
import com.itau.mastermind.util.FusoHorarioPadrao;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Locale;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Nome de usuário já está em uso.");
        }
        String emailNorm = request.getEmail().trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmail(emailNorm)) {
            throw new BadRequestException("E-mail já está cadastrado.");
        }
        User user = new User(
                request.getUsername(),
                emailNorm,
                passwordEncoder.encode(request.getPassword())
        );
        user.setSecurityAnswerHash(passwordEncoder.encode(normalizeSecurityAnswer(request.getSecurityAnswer())));
        user = userRepository.save(user);
        return toUserResponse(user);
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsernameOrEmail(), request.getPassword()));
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new UnauthorizedException("Usuário não encontrado."));
        if (ajustarSequenciaSeUsuarioFicouInativo(user)) {
            userRepository.save(user);
        }
        String token = jwtUtil.generateToken(user.getUsername());
        return new LoginResponse(token, toUserResponse(user));
    }

    public UserResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado."));
        if (ajustarSequenciaSeUsuarioFicouInativo(user)) {
            userRepository.save(user);
        }
        return toUserResponse(user);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String emailNorm = request.getEmail().trim().toLowerCase(Locale.ROOT);
        User user = userRepository.findByEmail(emailNorm)
                .orElseThrow(() -> new BadRequestException("Não foi possível concluir a recuperação."));
        if (user.getSecurityAnswerHash() == null || user.getSecurityAnswerHash().isBlank()) {
            throw new BadRequestException("Esta conta não possui pergunta de segurança cadastrada.");
        }
        if (!passwordEncoder.matches(normalizeSecurityAnswer(request.getSecurityAnswer()), user.getSecurityAnswerHash())) {
            throw new BadRequestException("Resposta inválida ou dados incorretos.");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private boolean ajustarSequenciaSeUsuarioFicouInativo(User user) {
        if (user.getLastStreakDate() == null) {
            return false;
        }
        LocalDate today = LocalDate.now(FusoHorarioPadrao.BRASIL);
        LocalDate last = user.getLastStreakDate();
        long gap = ChronoUnit.DAYS.between(last, today);
        if (gap > 1) {
            user.setStreakDays(0);
            user.setLastStreakDate(null);
            return true;
        }
        return false;
    }

    private String normalizeSecurityAnswer(String raw) {
        if (raw == null) {
            return "";
        }
        return raw.trim().toLowerCase(Locale.ROOT);
    }

    private UserResponse toUserResponse(User user) {
        int streak = user.getStreakDays() != null ? user.getStreakDays() : 0;
        String lastStreakStr = null;
        if (user.getLastStreakDate() != null) {
            lastStreakStr = user.getLastStreakDate().toString();
        }
        LocalDate today = LocalDate.now(FusoHorarioPadrao.BRASIL);
        boolean streakWonToday = user.getLastStreakDate() != null && user.getLastStreakDate().equals(today);
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getBestScore(),
                streak,
                lastStreakStr,
                streakWonToday
        );
    }
}
