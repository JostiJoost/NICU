package org.example;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
//ToDo uitzoeken of de url, user en password hier nog wel nodig zijn aangezien ze al in de application.properties staan
public class DatabaseConnector {
    private static final String URL = "jdbc:postgresql://mi-x.nl:5432/se_groep5";
    private static final String USER = "se_groep5";
    private static final String PASSWORD = "4cBggXz3Ya38JY";

    public static Connection connect(){
        try {
            Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("Verbonden met de database!");
            return conn;
        } catch (SQLException e) {
            System.out.println("Verbinden met database mislukt");
            e.printStackTrace();
            return null;
        }
    }
}
