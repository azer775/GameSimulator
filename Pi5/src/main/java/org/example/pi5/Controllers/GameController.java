package org.example.pi5.Controllers;

import org.example.pi5.Services.GameService;
import org.example.pi5.entities.Game;
import org.example.pi5.entities.GameDTO;
import org.example.pi5.entities.Gamelatestdata;
import org.example.pi5.entities.User;
import org.example.pi5.repositories.UserazerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("games")
@CrossOrigin(origins = "http://localhost:4200")
public class GameController {
    @Autowired
    GameService gameService;
    @Autowired
    UserazerRepository userazerRepository;
    @PostMapping("/create")
    public Game createGame(@RequestBody GameDTO gameDTO) {
        return gameService.createGame(gameDTO);
    }
    @PostMapping("/save")
    public Game saveGame(@RequestBody GameDTO gameDTO) {
        return gameService.createGame(gameDTO);
    }
    @GetMapping("/getlatestdata/{id}")
    public List<Gamelatestdata> getgamelatest(@PathVariable int id) throws Exception {
        return gameService.getlatestdata1(id);
    }
    @GetMapping("byid/{id}")
    public Game getbyid(@PathVariable int id){
        return this.gameService.findbyid(id);
    }
    @GetMapping("getu/{u}")
    public User getu(@PathVariable String u){
        return userazerRepository.findByUsername(u);
    }
}
