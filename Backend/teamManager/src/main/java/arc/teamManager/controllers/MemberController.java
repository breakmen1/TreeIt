package arc.teamManager.controllers;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import arc.teamManager.entities.Member;
import arc.teamManager.repositories.MemberRepository;


@RestController
@CrossOrigin(origins = "https://team-manager-tan.vercel.app")
public class MemberController {
    @Autowired
    MemberRepository memberRepository;

    @GetMapping("/members")
    public List<Member> getAllUsers() {
        return memberRepository.findAll();
    }

}
