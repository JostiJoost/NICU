
package org.example.protocol;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * De rest-controller die voor de API-endpoints zorgt van protocollen en tegenlezers.
 *
 * @author Anne Beumer en Joost Goddijn
 * @version 1.0
 * @since 14-05-2025
 */
@RestController
@RequestMapping("/api")
public class ProtocolController {
    @Autowired
    private ProtocolRepository protocolRepository;
    @Autowired
    private TegenlezerRepository tegenlezerRepository;

    /**
     * Haalt een gesorteerde lijst van protocolnamen op.
     * @return lijst met protocolnamen
     */

    @GetMapping("/protocollen")
    public List<String> getProtocollen() {
        return protocolRepository.findAll()
                .stream()
                .map(Protocol::getNaamProtocol)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    /**
     * Haalt de gegevens van één specifiek protocol en de bijbehorende tegenlezer op.
     * @param naam van het protocol
     * @return protocl en tegenlezer als JSON
     */
    @GetMapping("/protocollen/{naam}")
    public ResponseEntity<Map<String, Object>> getProtocol (@PathVariable String naam){
        Optional<Protocol> protocolOptional = protocolRepository.findById(naam);
        if(protocolOptional.isEmpty()){
            return ResponseEntity.notFound().build();
        }

        Protocol protocol = protocolOptional.get();
        Tegenlezer tegenlezer = tegenlezerRepository.findBynaamProtocol(naam).stream().findFirst().orElse(null);

        Map<String, Object> response = new HashMap<>();
        response.put("protocol", protocol);
        response.put("tegenlezer", tegenlezer);
        return ResponseEntity.ok(response);
    }

    /**
     * Slaat een nieuw of bestaand protocol en tegenlezer op.
     * @param request de class met protocol en tegenlezer
     * @return HTTP 200 (alles goed verlopen) bij succes of HTTP 500 (fout in backend of verwerking) bij een fout.
     */

    @PostMapping("/protocollen")
    public ResponseEntity<String> saveProtocol(@RequestBody ProtocolRequest request) {
        try{
            Protocol protocol = request.getProtocol();
            protocolRepository.save(protocol);
            System.out.println("Protocol opgeslagen: " + protocol.getNaamProtocol());

            String naamProtocol = protocol.getNaamProtocol();
            tegenlezerRepository.deleteAll(tegenlezerRepository.findBynaamProtocol(naamProtocol));

            Tegenlezer tegenlezer = request.getTegenlezer();
            if(tegenlezer != null && tegenlezer.getNaamTegenlezer() != null){
                tegenlezer.setNaamProtocol(naamProtocol);
                tegenlezerRepository.save(tegenlezer);
                System.out.println("Tegenlezer opgeslagen" + tegenlezer.getNaamTegenlezer());
            }
            return ResponseEntity.ok("Opgeslagen");
        } catch(Exception exception){
            exception.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Fout bij opslaan");}
    }

    /**
     * Verwijdert een protocol en de bijbheorende tegenlezer uit de database op basis van de protocol naam
     * @param naam van het protocol
     * @return HTTP 200 (goed verlopen) bij succes of HTTP 404  (object niet gevonden) als het protocol niet bestaat
     */
    @DeleteMapping("/protocollen/{naam}")
    public ResponseEntity<String> deleteProtocol(@PathVariable String naam){
        if(!protocolRepository.existsById(naam)){return ResponseEntity.notFound().build();}
        tegenlezerRepository.deleteAll(tegenlezerRepository.findBynaamProtocol(naam));
        protocolRepository.deleteById(naam);

        return ResponseEntity.ok("Verwijderd");
    }

    /**
     * Haalt tellingen op van protocollen per categorie of status.
     * @return een lijst met tellingen
     */
    @GetMapping("/protocollen/count")
    public List<Object[]> getProtocolCount() {
        return protocolRepository.findProtocolCount();
    }

    /**
     * Haalt tellingen op van afgeronde protocollen
     * @return een lijst met tellingen an afgeronde protocollen.
     */
    @GetMapping("/protocollen/count/finished")
    public List<Object[]> getFinishedProtocolCount() {
        return protocolRepository.findProtocolFinishedCount();
    }

    /**
     * Haalt een lijst op van protocollen met bijbehorende datums
     * @return lijst van protocollen met datums.
     */
    @GetMapping("/protocollen/datums")
    public List<ProtocolDTO> getDatums() {
        return protocolRepository.findAllDatums();
    }
}
