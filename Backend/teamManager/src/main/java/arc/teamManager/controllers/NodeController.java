package arc.teamManager.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import arc.teamManager.entities.GraphEdge;
import arc.teamManager.entities.GraphNode;
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

    @GetMapping("/load/{projectId}")
    public ResponseEntity<GraphDataRequest> loadGraph(@PathVariable String projectId) {
        try {
            List<GraphNode> nodes = nodeRepo.findByProjectId(projectId);
            List<GraphEdge> edges = edgeRepo.findByProjectId(projectId);

            GraphDataRequest response = new GraphDataRequest();
            response.setNodes(nodes);
            response.setEdges(edges);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new GraphDataRequest());
        }
    }
}
