package org.example.pi5.Controllers;

import org.example.pi5.Services.GamePortfolioService;
import org.example.pi5.entities.GamePortfolio;
import org.example.pi5.entities.GamePortfolioDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("gameportfolio")
@CrossOrigin(origins = "*")
public class GamePortfolioController {
    @Autowired
    GamePortfolioService gamePortfolioService;

    @PostMapping("sav")
    public GamePortfolio save(@RequestBody GamePortfolioDTO dto){
        System.out.println("controller"+dto);
        return this.gamePortfolioService.add(dto);
    }
    @GetMapping("getport/{idg}/{idu}")
    public GamePortfolio get(@PathVariable(name = "idg") int idg,@PathVariable(name = "idu")int idu){
        return this.gamePortfolioService.findbygameandplayer(idg,idu);
    }
    @PostMapping("save/{idg}/{idu}")
    public GamePortfolio save2(@PathVariable(name = "idg") int idg,@PathVariable(name = "idu")int idu,@RequestBody GamePortfolio gamePortfolio){
        return gamePortfolioService.createbyuserandgame(idg, idu);
    }
}
