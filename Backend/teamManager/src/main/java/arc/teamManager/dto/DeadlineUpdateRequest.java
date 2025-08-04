package arc.teamManager.dto;

import lombok.Data;

@Data
public class DeadlineUpdateRequest {
    private String graphNodeId;
    private String deadline; // Make sure it matches the column type
}