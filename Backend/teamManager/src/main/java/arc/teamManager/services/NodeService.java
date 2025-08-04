package arc.teamManager.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import arc.teamManager.dto.DeadlineUpdateRequest;
import arc.teamManager.entities.GraphNode;
import arc.teamManager.repositories.NodeRepository;
import arc.teamManager.repositories.EdgeRepository;

@Service
public class NodeService {

    @Autowired
    private NodeRepository nodeRepo;

    @Autowired
    private EdgeRepository edgeRepo;

    public String updatedDescription(String description, String nodeId) {
        GraphNode node = nodeRepo.findById(nodeId)
                .orElseThrow(() -> new RuntimeException("Node not found"));

        node.setDescription(description);
        GraphNode resNode = nodeRepo.save(node);
        String updatedDescription = resNode.getDescription();
        return updatedDescription;
    }

    public GraphNode deleteNode(String nodeId) {
        GraphNode deletedNode = nodeRepo.findById(nodeId).orElse(null);
        if (deletedNode != null) {
            nodeRepo.deleteById(nodeId);
        }
        return deletedNode;
    }

    public String deleteNodeEdges(String nodeId) {
        edgeRepo.deleteBySource(nodeId);
        edgeRepo.deleteByTarget(nodeId);
        return "deleted..";
    }

    public void updateDeadline(String nodeId, String newDeadline) {
        Optional<GraphNode> optionalNode = nodeRepo.findById(nodeId);
        if (optionalNode.isPresent()) {
            GraphNode node = optionalNode.get();
            node.setDeadline(newDeadline);
            nodeRepo.save(node);
        } else {
            throw new RuntimeException("GraphNode not found with ID: " + nodeId);
        }
    }

}
