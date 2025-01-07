package org.example.pi5.Services;

import org.example.pi5.entities.*;
import org.example.pi5.repositories.GamePortfolioRepository;
import org.example.pi5.repositories.GameRepository;
import org.example.pi5.repositories.GameTradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class GameTradeService {
    @Autowired
    GameTradeRepository gameTradeRepository;
    @Autowired
    GameRepository gameRepository;
    @Autowired
    GamePortfolioRepository gamePortfolioRepository;
    @Autowired
    CompanyService companyService;

    public GameTrade add(GameTradeDTO dto){
        System.out.println("dto:"+dto);
        GameTrade gameTrade=new GameTrade();
        gameTrade.setTradeDate(LocalDateTime.now());
        gameTrade.setCompany(new Company(dto.getCompany()));
        gameTrade.setPortfolio(new GamePortfolio(dto.getPortfolio()));
        gameTrade.setPrice(dto.getPrice());
        gameTrade.setPosition(dto.getPosition());
        gameTrade.setState(dto.getState());
        gameTrade.setShares(dto.getShares());
        if(dto.getStopLoss()!=null){
            gameTrade.setStopLoss(dto.getStopLoss());
        }
        if(dto.getTakeProfit()!=null){
            gameTrade.setTakeProfit(dto.getTakeProfit());
        }
        GamePortfolio gamePortfolio= this.gamePortfolioRepository.findById(dto.getPortfolio()).orElse(null);
        assert gamePortfolio != null;
        gamePortfolio.setCurrentCash(gamePortfolio.getCurrentCash()-gameTrade.getPrice()*dto.getShares());
        this.gamePortfolioRepository.save(gamePortfolio);
        return this.gameTradeRepository.save(gameTrade);
    }
    public List<GameTrade> getbygameanduser(int idu,int idg){
        Game g=gameRepository.findById(idg);
        User user= new User(idu);
        return gameTradeRepository.findGameTradesByUserAndGame(user,g);
    }
    @Scheduled(fixedRate = 500000) // Run every 5 seconds
    public void monitorPrices() throws Exception {
        List<GameTrade> openTrades = gameTradeRepository.foreclosure();//.findByState("OPEN");
        System.out.println("game trades"+openTrades);
        for (GameTrade trade : openTrades) {
            double currentPrice = companyService.getCurrentPrice(trade.getCompany().getId()); // Fetch current price
            Double stopLoss = trade.getStopLoss();
            Double takeProfit = trade.getTakeProfit();

            if ("LONG".equals(trade.getPosition())) {
                // Logic for long position
                if (currentPrice <= stopLoss) {
                    close1(trade,0);
                } else if (currentPrice >= takeProfit) {
                    close1(trade, currentPrice);
                }
            } else if ("SHORT".equals(trade.getPosition())) {
                // Logic for short position
                if (currentPrice >= stopLoss) {
                    close1(trade, currentPrice);
                } else if (currentPrice <= takeProfit) {
                    close1(trade, currentPrice);
                }
            }
        }
    }


    public GameTrade close(int id,double currentprice){
        GameTrade gameTrade=this.gameTradeRepository.findById(id).orElse(null);
        assert gameTrade != null;
        gameTrade.getPortfolio().setCurrentCash(gameTrade.getPortfolio().getCurrentCash()+currentprice*gameTrade.getShares());
        this.gamePortfolioRepository.save(gameTrade.getPortfolio());
        gameTrade.setState("CLOSE");
        return this.gameTradeRepository.save(gameTrade);
    }
    public void close1(GameTrade gameTrade, double currentprice){

        gameTrade.getPortfolio().setCurrentCash(gameTrade.getPortfolio().getCurrentCash()+currentprice*gameTrade.getShares());
        this.gamePortfolioRepository.save(gameTrade.getPortfolio());
        gameTrade.setState("CLOSE");
        this.gameTradeRepository.save(gameTrade);
    }
}
