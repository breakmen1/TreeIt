package arc.teamManager.entities;

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
@Table(name = "NODE")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Node {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NODE_ID")
    private Long nodeId;

    @Column(name = "PROJECT_ID")
    private Long projectId;

    @Column(name = "PARENT_NODE")
    private Long parentNode;

    @Column(name = "CHILD_NODE")
    private Long childNode;

    @Column(name = "ASSIGNED_TO")
    private String assignedTo;
}
