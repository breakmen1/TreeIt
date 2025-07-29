package arc.teamManager.dto;

import java.util.List;

public class MemberIdsRequest {
    private List<Long> memberIds;

    public List<Long> getMemberIds() {
        return memberIds;
    }

    public void setMemberIds(List<Long> memberIds) {
        this.memberIds = memberIds;
    }
}