package org.example.pi5.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    private LocalDateTime startDate;

    private LocalDateTime endDate;
    private boolean Allowstoploss;
    private boolean Allowshortpos;
    private boolean Allowlongpos;
    private boolean Allowtakeprofit;
    private LocalDateTime virtualStartDate;
    @Column(unique = true, nullable = false, updatable = false)
    private String uniqueCode;

    private int simulationDays;
    private int candlesPerDay;

    private double startingAmount;

    public Game(int gameId) {
        this.id=gameId;
    }
    /**/
    @PrePersist
    private void generateUniqueCode() {
        // Generate a unique code using UUID and a prefix, can be customized
        this.uniqueCode = "G-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
