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
    @Column(name = "GRAPHNODE_ID", nullable = false)
    private String graphNodeId;

    @Column(name = "PROJECT_ID")
    private String projectId;

    @Column(name = "TASK")
    private String task;

    @Column(name = "ASSIGNED_TO")
    private String assignedTo;

    @Column(name = "ASSIGNED_AT")
    private LocalDateTime assignedAt;

    @Column(name = "DEADLINE")
    private String deadline;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "POS_X")
    private int posX;

    @Column(name = "POS_Y")
    private int posY;

}
