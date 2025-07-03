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
@Table(name = "GRAPH_EDGE")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GraphEdge {
    @Id
    @Column(name = "GraphEdge_ID")
    private Long graphEdgeId;

    @Column(name = "PROJECT_ID")
    private Long projectId;

    @Column(name = "SOURCE")
    private String source;

    @Column(name = "TARGET")
    private String target;
}
