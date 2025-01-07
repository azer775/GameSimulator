package org.example.pi5.Controllers;

import org.example.pi5.Services.CompanyService;
import org.example.pi5.entities.CandlestickData;
import org.example.pi5.entities.Company;
import org.example.pi5.entities.CompanyDTO;
import org.example.pi5.entities.News;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("company")
@CrossOrigin(origins = "http://localhost:4200")
public class CompanyController {
    @Autowired
    CompanyService companyService;
    @PostMapping("addCompany/{gameId}")
    public List<CandlestickData> addCompany(@PathVariable int gameId,
                                            @RequestBody CompanyDTO companyDTO,
                                            @RequestParam List<String> trends) {
        return companyService.addCompany(companyDTO, gameId, trends);
    }
    @PostMapping("save/{gameId}")
    public Company saveCompany(@RequestBody CompanyDTO companyDTO, @PathVariable int gameId) throws IOException {
        if(companyDTO.getNews()!=null) {
            for(News a : companyDTO.getNews()){
                System.out.println(a);
            }
            return companyService.saveCompany(companyDTO, gameId);
        }
        for(News a : companyDTO.getNews()){
            System.out.println(a);
        }
        return null;
    }
    @GetMapping("getdata/{id}")
    public List<CandlestickData> getdata(@PathVariable int id) throws Exception {

        return companyService.getData(id);
    }
    @GetMapping("getbyid/{id}")
    public Company getbyid(@PathVariable int id){
        return companyService.getbyid(id);
    }
}
