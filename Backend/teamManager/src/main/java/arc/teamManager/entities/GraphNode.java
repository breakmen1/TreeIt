package arc.teamManager.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "GRAPH_NODE")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GraphNode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "GraphNode_ID")
    private Long graphNodeId;

    @Column(name = "PROJECT_ID")
    private Long projectId;

    @Column(name = "LABEL")
    private String label;

    @Column(name = "ASSIGNED_TO")
    private String assignedTo;

    @Column(name = "ASSIGNED_AT")
    private LocalDateTime assignedAt;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "DESCRIPTION", length = 1000)
    private String description;

    @Column(name = "POS_X")
    private int posX;

    @Column(name = "POS_Y")
    private int posY;

}
