package com.itau.mastermind.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email"),
    @UniqueConstraint(columnNames = "username")
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(nullable = false, unique = true)
    private String username;

    @NotBlank
    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String password;

    @Column(length = 100)
    private String securityAnswerHash;

    private Integer streakDays = 0;

    private LocalDate lastStreakDate;

    private Integer bestScore = 0;

    private Instant bestScoreAt;

    private Integer bestScoreEasy = 0;
    private Instant bestScoreAtEasy;

    private Integer bestScoreMedium = 0;
    private Instant bestScoreAtMedium;

    private Integer bestScoreHard = 0;
    private Instant bestScoreAtHard;

    /** Melhor tempo (segundos) na vitória que gerou o bestScore global; desempate com mesma quantidade de tentativas. */
    private Long bestDurationSecs;

    private Long bestDurationSecsEasy;
    private Long bestDurationSecsMedium;
    private Long bestDurationSecsHard;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Game> games = new ArrayList<>();

    public User() {
    }

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSecurityAnswerHash() {
        return securityAnswerHash;
    }

    public void setSecurityAnswerHash(String securityAnswerHash) {
        this.securityAnswerHash = securityAnswerHash;
    }

    public Integer getStreakDays() {
        return streakDays;
    }

    public void setStreakDays(Integer streakDays) {
        this.streakDays = streakDays;
    }

    public LocalDate getLastStreakDate() {
        return lastStreakDate;
    }

    public void setLastStreakDate(LocalDate lastStreakDate) {
        this.lastStreakDate = lastStreakDate;
    }

    public Integer getBestScore() {
        return bestScore;
    }

    public void setBestScore(Integer bestScore) {
        this.bestScore = bestScore;
    }

    public Instant getBestScoreAt() {
        return bestScoreAt;
    }

    public void setBestScoreAt(Instant bestScoreAt) {
        this.bestScoreAt = bestScoreAt;
    }

    public Integer getBestScoreEasy() {
        return bestScoreEasy;
    }

    public void setBestScoreEasy(Integer bestScoreEasy) {
        this.bestScoreEasy = bestScoreEasy;
    }

    public Instant getBestScoreAtEasy() {
        return bestScoreAtEasy;
    }

    public void setBestScoreAtEasy(Instant bestScoreAtEasy) {
        this.bestScoreAtEasy = bestScoreAtEasy;
    }

    public Integer getBestScoreMedium() {
        return bestScoreMedium;
    }

    public void setBestScoreMedium(Integer bestScoreMedium) {
        this.bestScoreMedium = bestScoreMedium;
    }

    public Instant getBestScoreAtMedium() {
        return bestScoreAtMedium;
    }

    public void setBestScoreAtMedium(Instant bestScoreAtMedium) {
        this.bestScoreAtMedium = bestScoreAtMedium;
    }

    public Integer getBestScoreHard() {
        return bestScoreHard;
    }

    public void setBestScoreHard(Integer bestScoreHard) {
        this.bestScoreHard = bestScoreHard;
    }

    public Instant getBestScoreAtHard() {
        return bestScoreAtHard;
    }

    public void setBestScoreAtHard(Instant bestScoreAtHard) {
        this.bestScoreAtHard = bestScoreAtHard;
    }

    public Long getBestDurationSecs() {
        return bestDurationSecs;
    }

    public void setBestDurationSecs(Long bestDurationSecs) {
        this.bestDurationSecs = bestDurationSecs;
    }

    public Long getBestDurationSecsEasy() {
        return bestDurationSecsEasy;
    }

    public void setBestDurationSecsEasy(Long bestDurationSecsEasy) {
        this.bestDurationSecsEasy = bestDurationSecsEasy;
    }

    public Long getBestDurationSecsMedium() {
        return bestDurationSecsMedium;
    }

    public void setBestDurationSecsMedium(Long bestDurationSecsMedium) {
        this.bestDurationSecsMedium = bestDurationSecsMedium;
    }

    public Long getBestDurationSecsHard() {
        return bestDurationSecsHard;
    }

    public void setBestDurationSecsHard(Long bestDurationSecsHard) {
        this.bestDurationSecsHard = bestDurationSecsHard;
    }

    public List<Game> getGames() {
        return games;
    }

    public void setGames(List<Game> games) {
        this.games = games;
    }
}
