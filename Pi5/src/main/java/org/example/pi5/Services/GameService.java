package org.example.pi5.Services;

import org.example.pi5.entities.*;
import org.example.pi5.repositories.CompanyRepository;
import org.example.pi5.repositories.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class GameService {
    @Autowired
    GameRepository gameRepository;
    @Autowired
    CompanyService companyService;
    @Autowired
    CompanyRepository companyRepository;
    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
    public Game createGame(GameDTO gameDTO) {
        Game game = new Game();
        game.setName(gameDTO.getName());
        game.setStartDate(LocalDateTime.parse(gameDTO.getStartDate(), formatter));
        game.setEndDate(LocalDateTime.parse(gameDTO.getEndDate(), formatter));
        game.setVirtualStartDate(LocalDateTime.parse(gameDTO.getVirtualStartDate(), formatter));
        game.setSimulationDays(gameDTO.getSimulationDays());
        game.setStartingAmount(gameDTO.getStartingAmount());
        game.setAllowlongpos(gameDTO.isAllowlongpos());
        game.setAllowshortpos(gameDTO.isAllowshortpos());
        game.setAllowstoploss(gameDTO.isAllowstoploss());
        game.setAllowtakeprofit(gameDTO.isAllowtakeprofit());
        game.setCandlesPerDay(gameDTO.getCandlesPerDay());
        return gameRepository.save(game);
    }
    public List<Gamelatestdata> getlatestdata(int id) throws Exception {
        Game game=gameRepository.findById(id);
        List<Company> lc=companyRepository.findCompanyByGame(game);
         return lc.parallelStream()
                .map(company -> {
                    try {
                        // Fetch last two prices for the company
                        DateData lastData = companyService.getlastdata(company.getId());

                        // Map data to Gamelatestdata
                        if (lastData.getList().size() >= 2) {
                            Gamelatestdata gamelatestdata = new Gamelatestdata();
                            gamelatestdata.setCompany(company);
                            gamelatestdata.setLatestprice(lastData.getList().get(0));
                            gamelatestdata.setPrelatestprice(lastData.getList().get(1));
                            gamelatestdata.setDatetime(lastData.getDateTime());
                            return gamelatestdata;
                        }
                    } catch (Exception e) {
                        e.printStackTrace(); // Handle exceptions gracefully
                    }
                    return null; // Skip companies with errors or insufficient data
                })
                .filter(Objects::nonNull) // Remove any null entries
                .collect(Collectors.toList());
    }
    public Game findbyid(int id){
        return this.gameRepository.findById(id);
    }
    public List<Gamelatestdata> getlatestdata1(int id) throws Exception {
        Game game = gameRepository.findById(id);
        List<Company> lc = companyRepository.findCompanyByGame(game);

        // Prefetch data for all companies in one go
        Map<Integer, DateData> companyDataMap = lc.parallelStream()
                .collect(Collectors.toMap(
                        Company::getId,
                        company -> {
                            try {
                                return companyService.getlastdata(company.getId());
                            } catch (Exception e) {
                                e.printStackTrace();
                                return null; // Skip companies with errors
                            }
                        }
                ));

        // Map data to Gamelatestdata
        return lc.stream()
                .filter(company -> companyDataMap.get(company.getId()) != null) // Skip companies with errors
                .map(company -> {
                    DateData lastData = companyDataMap.get(company.getId());
                    if (lastData.getList().size() >= 2) {
                        Gamelatestdata gamelatestdata = new Gamelatestdata();
                        gamelatestdata.setCompany(company);
                        gamelatestdata.setLatestprice(lastData.getList().get(0));
                        gamelatestdata.setPrelatestprice(lastData.getList().get(1));
                        gamelatestdata.setDatetime(lastData.getDateTime());
                        return gamelatestdata;
                    }
                    return null; // Skip companies with insufficient data
                })
                .filter(Objects::nonNull) // Remove any null entries
                .collect(Collectors.toList());
    }
    public List<Game> getall(){
        return gameRepository.findAll();
    }
}
