package org.example.pi5.entities;

import jakarta.persistence.ManyToOne;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class GameTradeDTO {
    private String position; // "short" or "long"
    private int shares;
    private double price;
    private int portfolio;
    private int company;
    private String state;
    private Double stopLoss;
    private Double takeProfit;

}
