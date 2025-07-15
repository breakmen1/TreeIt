package arc.teamManager.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import arc.teamManager.entities.Member;
import arc.teamManager.entities.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByMemberMemberId(Long memberId);

    List<Project> findByMembers_MemberId(Long memberId);

    List<Project> findAllByMembersContaining(Member member);

    @Query("SELECT p FROM Project p WHERE p.member = :member OR :member MEMBER OF p.members")
    List<Project> findProjectsVisibleToMember(@Param("member") Member member);  

}