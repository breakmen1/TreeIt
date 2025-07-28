package arc.teamManager.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import arc.teamManager.entities.Member;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByUsername(String username);
    Optional<Member> findByMail(String mail);
    Optional<Member> findByEmployeeId(String employeeId);
    
    @Query("SELECT m FROM Member m WHERE m.memberId = :memberId")
    Optional<Member> findMyMember(@Param("memberId") Long memberId);
}