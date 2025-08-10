package arc.teamManager.models;

import arc.teamManager.dto.NodeDTO;
import arc.teamManager.entities.GraphNode;

public class MailRequest {
    private NodeDTO node;

    public NodeDTO getNode() {
        return node;
    }

    public void setNode(NodeDTO node) {
        this.node = node;
    }

    
}
