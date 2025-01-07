package org.example.pi5.Controllers;

import org.example.pi5.Services.CompanyService;
import org.example.pi5.Services.GameService;
import org.example.pi5.Services.GameTradeService;
import org.example.pi5.entities.CandlestickData;
import org.example.pi5.entities.Game;
import org.example.pi5.entities.GameTrade;
import org.example.pi5.entities.Gamelatestdata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api") // Ensure all endpoints are under /api
@CrossOrigin("*")
public class GameDataController {
    @Autowired
    private CompanyService companyService;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    GameTradeService gameTradeService;
    @Autowired
    GameService gameService;
    // WebSocket endpoint to handle candlestick updates
    @MessageMapping("/candlesticks/{id}")
    public void updateCandlestick(@DestinationVariable int id) throws Exception {

        simpMessagingTemplate.convertAndSend("/topic/candlesticks/" + id, this.companyService.getData(id));
    }
    @MessageMapping("/gamedata/{idu}/{idg}")
    public void getbyport(@DestinationVariable int idu, @DestinationVariable int idg){
        simpMessagingTemplate.convertAndSend("/topic/trades/" + idu+"/"+idg, this.gameTradeService.getbygameanduser(idu, idg));
    }

    @MessageMapping("/getlatestdata/{id}")
    public void getgamelatest(@DestinationVariable int id) throws Exception {
        simpMessagingTemplate.convertAndSend("/topic/gamecomp/" + id, this.gameService.getlatestdata1(id));
    }

    // HTTP GET endpoint to fetch all candlesticks
   /* @GetMapping("/candlesticks/{id}")
    public List<CandlestickData> getAllCandlesticks(@PathVariable int id) throws Exception {
        return companyService.getData(id);
    }*/


}
