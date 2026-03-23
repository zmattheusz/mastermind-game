package com.itau.mastermind.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DbStartupMigration {

    @Bean
    public ApplicationRunner widenPasswordColumn(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                Integer len = jdbcTemplate.queryForObject(
                        """
                        SELECT CHARACTER_MAXIMUM_LENGTH
                        FROM INFORMATION_SCHEMA.COLUMNS
                        WHERE TABLE_NAME = 'USERS' AND COLUMN_NAME = 'PASSWORD'
                        """,
                        Integer.class
                );

                if (len != null && len > 0 && len < 60) {
                    jdbcTemplate.execute("ALTER TABLE USERS ALTER COLUMN PASSWORD VARCHAR(100)");
                }
            } catch (Exception e) {
            }
        };
    }
}

