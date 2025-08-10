package arc.teamManager.dto;

public class NodeDTO {
    private String id;
    private PositionDTO position;
    private String type;
    private NodeDataDTO data;
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public PositionDTO getPosition() {
        return position;
    }
    public void setPosition(PositionDTO position) {
        this.position = position;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public NodeDataDTO getData() {
        return data;
    }
    public void setData(NodeDataDTO data) {
        this.data = data;
    }

    // Getters and Setters
    
}
