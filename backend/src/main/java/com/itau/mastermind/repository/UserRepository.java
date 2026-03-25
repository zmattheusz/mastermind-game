package com.itau.mastermind.repository;

import com.itau.mastermind.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailIgnoreCase(String email);

    Optional<User> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    @Query("SELECT u FROM User u ORDER BY CASE WHEN u.bestScore IS NULL OR u.bestScore = 0 THEN 1 ELSE 0 END, u.bestScore ASC, CASE WHEN u.bestDurationSecs IS NULL THEN 1 ELSE 0 END, u.bestDurationSecs ASC, u.id ASC")
    List<User> findAllForRanking();

    @Query("SELECT u FROM User u ORDER BY CASE WHEN u.bestScoreEasy IS NULL OR u.bestScoreEasy = 0 THEN 1 ELSE 0 END, u.bestScoreEasy ASC, CASE WHEN u.bestDurationSecsEasy IS NULL THEN 1 ELSE 0 END, u.bestDurationSecsEasy ASC, u.id ASC")
    List<User> findAllForRankingEasy();

    @Query("SELECT u FROM User u ORDER BY CASE WHEN u.bestScoreMedium IS NULL OR u.bestScoreMedium = 0 THEN 1 ELSE 0 END, u.bestScoreMedium ASC, CASE WHEN u.bestDurationSecsMedium IS NULL THEN 1 ELSE 0 END, u.bestDurationSecsMedium ASC, u.id ASC")
    List<User> findAllForRankingMedium();

    @Query("SELECT u FROM User u ORDER BY CASE WHEN u.bestScoreHard IS NULL OR u.bestScoreHard = 0 THEN 1 ELSE 0 END, u.bestScoreHard ASC, CASE WHEN u.bestDurationSecsHard IS NULL THEN 1 ELSE 0 END, u.bestDurationSecsHard ASC, u.id ASC")
    List<User> findAllForRankingHard();
}
