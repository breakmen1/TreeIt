package arc.teamManager.dto;

public class MemberDTO {
    private Long memberId;
    private String username;

    public MemberDTO(Long memberId, String username) {
        this.memberId = memberId;
        this.username = username;
    }

    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

}