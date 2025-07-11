package arc.teamManager.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import arc.teamManager.dto.ProjectDTO;
import arc.teamManager.entities.Member;
import arc.teamManager.entities.Project;
import arc.teamManager.repositories.MemberRepository;
import arc.teamManager.repositories.ProjectRepository;

@RestController
@RequestMapping("/projects")
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private MemberRepository memberRepository;

    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @GetMapping("/member/{memberId}")
    public List<Project> getProjectsByUser(@PathVariable Long memberId) {
        return projectRepository.findByMemberMemberId(memberId);
    }

    @PostMapping
    public Project createProject(@RequestBody ProjectDTO projectDTO) {
        Member member =  memberRepository.findById(projectDTO.getMemberId()).orElseThrow();
        Project project = new Project();
        project.setMember(member);
        project.setName(projectDTO.getName());
        Project savedProject = projectRepository.save(project);
        return savedProject;
    }

}
