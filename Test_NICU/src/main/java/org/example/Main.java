package org.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.awt.*;
import java.io.IOException;
import java.net.URI;

/**
 * Startpunt van de Spring Boot toepassing
 * Start de applicatie op de standaard browser
 *
 * @author Anne Beumer en Joost Goddijn
 * @version 1.4, 22-05-2025
 * @since 09-05-2025
 */
@SpringBootApplication
public class Main extends SpringBootServletInitializer {

    /**
     * Main method die de Spring Boot applicatie opstart.
     * @param args args
     */
    public static void main(String[] args) {

        //BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        //String rawPassword = "2Sgt6!h";
        //String encodedPassword = encoder.encode(rawPassword);
        //System.out.println(encodedPassword);

        SpringApplication.run(Main.class, args);
        openBrowser("http://localhost:8080/login.html");
    }

    /**
     * Probeert de standaard browser te openen met de opgegeven url.
     * Zou moeten werken op zowel Windows als macOS.
     *
     * @param url de URL die geopend moet worden
     */
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