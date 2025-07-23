package arc.teamManager.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

            Member member = memberRepository.findByUsername(request.getUsername()).orElse(null);

            if (member == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            return ResponseEntity.ok(member.getMemberId()); // Return memberId or a token
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Member member) {
        if (memberService.userExists(member.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        member.setPassword(passwordEncoder.encode(member.getPassword()));
        Member savedMember = memberRepository.save(member);
        return ResponseEntity.ok("User registered successfully with ID: " + savedMember.getMemberId());
    }
}
