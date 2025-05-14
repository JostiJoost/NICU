package org.example;

import org.example.inclusie.InclusionController;
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
        //String rawPassword = "Ka216!vG";
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
            if (Desktop.isDesktopSupported()) {
                Desktop.getDesktop().browse(new URI(url));
            } else {
                // Fallback voor macOS
                Runtime.getRuntime().exec(new String[]{"open", url});
            }
        } catch (Exception e) {
            System.err.println("Kon browser niet openen: " + e.getMessage());
        }
    }


}