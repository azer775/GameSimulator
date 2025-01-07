package org.example.pi5.entities;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DateData {
    LocalDateTime dateTime;
    List<Double> list;
}
