package arc.teamManager.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import arc.teamManager.entities.Member;
import arc.teamManager.models.LoginRequest;
import arc.teamManager.repositories.MemberRepository;
import arc.teamManager.services.MemberService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private MemberService memberService;

    @Autowired
    private MemberRepository memberRepository;

    @PostMapping("/login")
    public Long login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
            // Normally, you'd return a JWT here. For now:
            Member member = memberRepository.findByUsername(request.getUsername()).get();
            return member.getMemberId();
        } catch (AuthenticationException e) {
            return null;
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Member member) {
        if (memberService.userExists(member.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        Member savedMember = memberService.register(member);
        return ResponseEntity.ok("User registered successfully with ID: " + savedMember.getMemberId());
    }
}
