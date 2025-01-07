package org.example.pi5.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GamePortfolio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private double currentCash;
    @ManyToOne
    private User player;
    @ManyToOne
    private Game game;

    public GamePortfolio(int id) {
        this.id = id;
    }
}
