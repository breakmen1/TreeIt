package arc.teamManager.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import arc.teamManager.entities.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

}