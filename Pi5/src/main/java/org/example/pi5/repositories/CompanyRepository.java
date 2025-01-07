package org.example.pi5.repositories;

import org.example.pi5.entities.Company;
import org.example.pi5.entities.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface CompanyRepository extends JpaRepository<Company,Integer> {
    List<Company> findCompanyByGame(Game game);
}
