package arc.teamManager.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import arc.teamManager.dto.MemberDTO;
import arc.teamManager.dto.ProjectDTO;
import arc.teamManager.entities.Member;
import arc.teamManager.entities.Project;
import arc.teamManager.repositories.MemberRepository;
import arc.teamManager.repositories.ProjectRepository;
import arc.teamManager.services.ProjectService;

@RestController
@RequestMapping("/projects")
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private ProjectService projectService;

    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @GetMapping("/{projectId}/members")
    public ResponseEntity<List<MemberDTO>> getProjectMembers(@PathVariable Long projectId) {
        List<MemberDTO> members = projectService.getProjectMembers(projectId);
        return ResponseEntity.ok(members);
    }

    @GetMapping("/member/{memberId}")
    public List<Project> getProjectsByMemberId(@PathVariable Long memberId) {
        return projectService.getProjectsByMemberId(memberId);
    }

    @PostMapping
    public Project createProject(@RequestBody ProjectDTO projectDTO) {
        Member member = memberRepository.findById(projectDTO.getMemberId()).orElseThrow();
        Project project = new Project();
        project.setMember(member);
        project.setName(projectDTO.getName());
        project.setMembers(memberRepository.findAllById(projectDTO.getMemberIds()));

        Project savedProject = projectRepository.save(project);
        return savedProject;
    }

}
