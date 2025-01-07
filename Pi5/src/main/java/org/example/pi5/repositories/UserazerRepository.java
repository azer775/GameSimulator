package org.example.pi5.repositories;

import org.example.pi5.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserazerRepository extends JpaRepository<User,Integer> {
    User findByUsername(String username);
}
