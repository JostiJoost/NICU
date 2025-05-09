package org.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
@SpringBootApplication
public class Main {

    public static void main(String[] args) {

        //BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        //String rawPassword = "Ka216!vG";
        //String encodedPassword = encoder.encode(rawPassword);
        //System.out.println(encodedPassword);

        DatabaseQuery.select();
        SpringApplication.run(Main.class, args);
        //DatabaseQuery.insert();
        //DatabaseQuery.select();
    }

}