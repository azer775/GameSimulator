package org.example.pi5;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling

public class Pi5Application {

    public static void main(String[] args) {
        SpringApplication.run(Pi5Application.class, args);
    }

}
