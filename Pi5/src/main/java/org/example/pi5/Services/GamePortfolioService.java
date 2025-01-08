package org.example.pi5.Services;

import org.example.pi5.entities.Game;
import org.example.pi5.entities.GamePortfolio;
import org.example.pi5.entities.GamePortfolioDTO;
import org.example.pi5.entities.User;
import org.example.pi5.repositories.GamePortfolioRepository;
import org.example.pi5.repositories.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GamePortfolioService {
    @Autowired
    GamePortfolioRepository gamePortfolioRepository;
    @Autowired
    GameRepository gameRepository;
    public GamePortfolio add(GamePortfolioDTO dto){
        System.out.println(dto);
        Game game= gameRepository.findGameByUniqueCode(dto.getGamecode());
        System.out.println(game);
        GamePortfolio gamePortfolio =new GamePortfolio();
        gamePortfolio.setGame(game);
        User user=new User();
        user.setId(dto.getPlayer());
        gamePortfolio.setPlayer(user);
        gamePortfolio.setCurrentCash(game.getStartingAmount());
        return gamePortfolioRepository.save(gamePortfolio);
    }
    public GamePortfolio findbygameandplayer(int idg,int idu){
        Game game=this.gameRepository.findById(idg);
        User u=new User();
        u.setId(idu);
        return this.gamePortfolioRepository.findByGameAndPlayer(game,u);
    }
    public GamePortfolio createbyuserandgame(int idg,int idu){
        Game game =gameRepository.findById(idg);
        GamePortfolio gamePortfolio =new GamePortfolio();
        gamePortfolio.setGame(game);
        User user=new User();
        user.setId(idu);
        gamePortfolio.setPlayer(user);
        gamePortfolio.setCurrentCash(game.getStartingAmount());
        return gamePortfolioRepository.save(gamePortfolio);
    }

}
