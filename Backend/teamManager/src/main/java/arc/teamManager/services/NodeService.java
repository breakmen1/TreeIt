package arc.teamManager.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import arc.teamManager.entities.GraphNode;
import arc.teamManager.models.GraphDataRequest;
import arc.teamManager.repositories.EdgeRepository;
import arc.teamManager.repositories.NodeRepository;

@Service
public class NodeService {

    @Autowired
    private NodeRepository nodeRepo;

    public String updatedDescription(String description, String nodeId) {
        GraphNode node = nodeRepo.findById(nodeId)
                .orElseThrow(() -> new RuntimeException("Node not found"));

        node.setDescription(description);
        GraphNode resNode = nodeRepo.save(node);
        String updatedDescription = resNode.getDescription();
        return updatedDescription;
    }

}
