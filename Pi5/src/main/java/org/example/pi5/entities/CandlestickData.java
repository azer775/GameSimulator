package org.example.pi5.entities;

import lombok.*;

import java.time.LocalDateTime;
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CandlestickData {
    LocalDateTime dateTime;
    double open;
    double high;
    double low;
    double close;
}
