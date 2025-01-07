package org.example.pi5.entities;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CompanyDTO {
    private String name;
    private String industry;
    private double initialPrice;
    private double volatility;
    private double drift;
    private List<CandlestickData> candlestickData;
    private List<News> news;
}
