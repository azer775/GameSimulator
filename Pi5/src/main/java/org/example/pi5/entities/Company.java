package org.example.pi5.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private String sector;
    private double marketCap;
    private double peRatio;
    private double debtToEquity;
    private double eps;
    private double dividendYield;
    private String stockFilePath;
    @ManyToOne
    private Game game;
    @OneToMany( cascade = CascadeType.ALL)
    List<News> news;

    public Company(int id) {
        this.id = id;
    }
}
