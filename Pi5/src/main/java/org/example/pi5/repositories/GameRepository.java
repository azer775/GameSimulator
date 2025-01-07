package org.example.pi5.repositories;

import org.example.pi5.entities.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends JpaRepository<Game,Integer> {
     Game findById(int id);
    public Game findGameByUniqueCode(String uniqueCode);
}
