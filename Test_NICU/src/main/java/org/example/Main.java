package org.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.awt.*;
import java.io.IOException;
import java.net.URI;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
@SpringBootApplication
public class Main {

    public static void main(String[] args) {

        //BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        //String rawPassword = "2Sgt6!h";
        //String encodedPassword = encoder.encode(rawPassword);
        //System.out.println(encodedPassword);

        //DatabaseQuery.select();
        SpringApplication.run(Main.class, args);
        openBrowser("http://localhost:8080/login.html");
        //DatabaseQuery.insert();
        //DatabaseQuery.select();
    }

    private static void openBrowser(String url) {
        try {
            String os = System.getProperty("os.name").toLowerCase();
            //Direct fallback voor Windows
            if (os.contains("win")) {
                Runtime.getRuntime().exec("rundll32 url.dll,FileProtocolHandler " + url);
            } else {
                // Fallback voor macOS
                Runtime.getRuntime().exec(new String[]{"open", url});
            }
        } catch (Exception e) {
            System.err.println("Kon browser niet openen: " + e.getMessage());
        }
    }


}