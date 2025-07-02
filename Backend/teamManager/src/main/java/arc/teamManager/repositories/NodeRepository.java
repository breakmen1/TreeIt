package arc.teamManager.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import arc.teamManager.entities.GraphNode;

public interface NodeRepository extends JpaRepository<GraphNode, Long> {

}