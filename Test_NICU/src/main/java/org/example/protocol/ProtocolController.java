
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

@RestController
@RequestMapping("/api")
public class ProtocolController {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private ProtocolRepository protocolRepository;
    @Autowired
    private TegenlezerRepository tegenlezerRepository;

    @GetMapping("/protocollen")
    public List<String> getProtocollen() {
        return protocolRepository.findAll()
                .stream()
                .map(Protocol::getNaamProtocol)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

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

    @DeleteMapping("/protocollen/{naam}")
    public ResponseEntity<String> deleteProtocol(@PathVariable String naam){
        if(!protocolRepository.existsById(naam)){return ResponseEntity.notFound().build();}
        tegenlezerRepository.deleteAll(tegenlezerRepository.findBynaamProtocol(naam));
        protocolRepository.deleteById(naam);

        return ResponseEntity.ok("Verwijderd");
    }

}
