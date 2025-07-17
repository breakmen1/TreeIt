package arc.teamManager.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import arc.teamManager.entities.GraphEdge;

@Repository
public interface EdgeRepository extends JpaRepository<GraphEdge, String> {
    List<GraphEdge> findByProjectId(String projectId);
}