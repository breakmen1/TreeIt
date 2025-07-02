package arc.teamManager.models;

import java.util.List;

import arc.teamManager.entities.GraphEdge;
import arc.teamManager.entities.GraphNode;
import lombok.Data;

@Data
public class GraphDataRequest {
    private List<GraphNode> nodes;
    private List<GraphEdge> edges;
}
