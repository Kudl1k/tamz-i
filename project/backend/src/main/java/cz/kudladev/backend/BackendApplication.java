package cz.kudladev.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;

import static org.hibernate.query.sqm.tree.SqmNode.log;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
        waitForKeyPress();
    }


    private static void waitForKeyPress() {
        try {
            System.in.read();
        } catch (IOException e) {
            log.error("Cannot read input from keyboard.", e);
        }
    }

}
