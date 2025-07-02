package arc.teamManager.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import arc.teamManager.models.GraphDataRequest;
import arc.teamManager.repositories.EdgeRepository;
import arc.teamManager.repositories.NodeRepository;

@Controller
public class NodeController {
    @Autowired
    private NodeRepository nodeRepo;

    @Autowired
    private EdgeRepository edgeRepo;

    @PostMapping("/save")
    public ResponseEntity<?> saveGraph(@RequestBody GraphDataRequest request) {
        nodeRepo.saveAll(request.getNodes());
        edgeRepo.saveAll(request.getEdges());
        return ResponseEntity.ok("Saved successfully");
    }

    @GetMapping("/load")
    public ResponseEntity<GraphDataRequest> loadGraph() {
        GraphDataRequest response = new GraphDataRequest();
        response.setNodes(nodeRepo.findAll());
        response.setEdges(edgeRepo.findAll());
        return ResponseEntity.ok(response);
    }
}
