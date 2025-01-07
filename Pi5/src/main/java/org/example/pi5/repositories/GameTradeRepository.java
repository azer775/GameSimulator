package org.example.pi5.repositories;

import org.example.pi5.entities.Game;
import org.example.pi5.entities.GameTrade;
import org.example.pi5.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameTradeRepository extends JpaRepository<GameTrade,Integer> {
    @Query("SELECT gt FROM GameTrade gt " +
            "JOIN gt.portfolio gp " +
            "JOIN gp.game g " +
            "JOIN gp.player u " +
            "WHERE u = :user AND g = :game")
    List<GameTrade> findGameTradesByUserAndGame(@Param("user") User user, @Param("game") Game game);

    List<GameTrade> findByState(String open);
    @Query("SELECT gt from GameTrade gt where gt.stopLoss != 0 and gt.takeProfit != 0 and gt.state = 'OPEN' ")
    List<GameTrade> foreclosure();
}
