package arc.teamManager.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import arc.teamManager.entities.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByUsername(String username);
}