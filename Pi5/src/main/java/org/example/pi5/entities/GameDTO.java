package org.example.pi5.entities;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class GameDTO {
    private String name;
    private String startDate;
    private String endDate;
    private String virtualStartDate;
    private int simulationDays;
    private double startingAmount;
    private boolean Allowstoploss;
    private boolean Allowshortpos;
    private boolean Allowlongpos;
    private boolean Allowtakeprofit;
    private int candlesPerDay;
}
