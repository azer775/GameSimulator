package org.example.pi5.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class GameTrade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String position; // "short" or "long"

    private int shares;

    private double price;

    private LocalDateTime tradeDate;

    private String state;
    private Double stopLoss;
    private Double takeProfit;

    @ManyToOne
    private GamePortfolio portfolio;

    @ManyToOne
    private Company company;
}
