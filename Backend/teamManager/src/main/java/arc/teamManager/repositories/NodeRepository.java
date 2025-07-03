package arc.teamManager.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import arc.teamManager.entities.GraphNode;

@Repository
public interface NodeRepository extends JpaRepository<GraphNode, Long> {

}