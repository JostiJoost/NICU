package org.example;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Scanner;

public class DatabaseQuery {
    public static void select () {
        try (Connection conn = DatabaseConnector.connect()) {
            if (conn != null) {
                String query = "SELECT * FROM \"centrum\"";

                Statement statement = conn.createStatement();
                ResultSet result = statement.executeQuery(query);

                while (result.next()) {
                    String Naam = result.getString("naam centrum");
                    int aantal_bedden = result.getInt("aantal IC bedden");

                    System.out.println("naam centrum: " + Naam + ", aantal IC bedden: " + aantal_bedden);
                }

                result.close();
                statement.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static void insert () {
        try (Connection conn = DatabaseConnector.connect()) {
            Scanner in = new Scanner(System.in);
            if (conn != null) {
                System.out.println("Welke instelling moet er worden toegevoegd?");
                String input = in.nextLine();
                String query = "INSERT INTO \"Instelling\" (\"Naam instelling\") VALUES (\'" + input + "\')";

                Statement statement = conn.createStatement();
                int rows = statement.executeUpdate(query);

                System.out.println("Rijen toegevoegd: " + rows);
                statement.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
