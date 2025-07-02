package arc.teamManager.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import arc.teamManager.entities.GraphEdge;

public interface EdgeRepository extends JpaRepository<GraphEdge, Long> {
    
}