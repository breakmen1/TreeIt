package arc.teamManager.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import arc.teamManager.dto.MemberDTO;
import arc.teamManager.entities.Project;
import arc.teamManager.repositories.ProjectRepository;

@Service
public class ProjectService {
    @Autowired
    ProjectRepository projectRepository;

    public List<MemberDTO> getProjectMembers(Long projectId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found"));

        // Convert Member entities to DTOs
        return project.getMembers()
                      .stream()
                      .map(member -> new MemberDTO(member.getMemberId(), member.getUsername()))
                      .collect(Collectors.toList());
    }
}
