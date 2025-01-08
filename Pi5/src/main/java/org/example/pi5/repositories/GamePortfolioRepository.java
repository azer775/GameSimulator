package org.example.pi5.repositories;

import org.example.pi5.entities.Game;
import org.example.pi5.entities.GamePortfolio;
import org.example.pi5.entities.GameTrade;
import org.example.pi5.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GamePortfolioRepository extends JpaRepository<GamePortfolio,Integer> {
    GamePortfolio findByGameAndPlayer(Game game, User player);
    @Query("SELECT gp.game  FROM GamePortfolio gp " +
            "WHERE gp.player = :user ")
    List<Game> findPortByUser(@Param("user") User user);
}
