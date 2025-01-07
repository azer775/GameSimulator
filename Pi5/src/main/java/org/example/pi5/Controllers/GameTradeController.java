package org.example.pi5.Controllers;

import org.example.pi5.Services.GameTradeService;
import org.example.pi5.entities.GameTrade;
import org.example.pi5.entities.GameTradeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("gametrade")
@CrossOrigin(origins = "http://localhost:4200")
public class GameTradeController {
    @Autowired
    GameTradeService gameTradeService;

    @PostMapping("add")
    public GameTrade add(@RequestBody GameTradeDTO dto){
        return this.gameTradeService.add(dto);
    }
    @GetMapping("getport/{idu}/{idg}")
    public List<GameTrade> getbyport(@PathVariable(name = "idu")int idu,@PathVariable(name = "idg")int idg){
        return this.gameTradeService.getbygameanduser(idu, idg);
    }
    @PutMapping("close/{id}/{price}")
    public GameTrade close(@PathVariable(name = "id") int id, @PathVariable(name = "price") double price){
        return this.gameTradeService.close(id,price);
    }
}
