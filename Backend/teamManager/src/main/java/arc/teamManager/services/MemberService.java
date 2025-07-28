package arc.teamManager.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import arc.teamManager.entities.Member;
import arc.teamManager.repositories.MemberRepository;

@Service
public class MemberService {
    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Member register(Member member) {
        member.setPassword(passwordEncoder.encode(member.getPassword()));
        return memberRepository.save(member);
    }

    public boolean usernameExists(String username) {
        return memberRepository.findByUsername(username).isPresent();
    }

    public boolean mailExists(String mail) {
        return memberRepository.findByMail(mail).isPresent();
    }

    public boolean employeeIdExists(String employeeId) {
        return memberRepository.findByEmployeeId(employeeId).isPresent();
    }
}
