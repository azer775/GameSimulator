package org.example.pi5.entities;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Gamelatestdata {
    double latestprice;
    double prelatestprice;
    Company company;
    LocalDateTime datetime;
}
