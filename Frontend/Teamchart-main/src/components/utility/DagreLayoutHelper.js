import dagre from "dagre";

const nodeWidth = 260;
const nodeHeight = 100;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// direction = TB (top-bottom), LR (left-right)
export const layoutNodesWithDagre = (nodes, edges, direction = "TB") => {
  dagreGraph.setGraph({ rankdir: direction });

  const getNodeSize = (type) => {
    switch (type) {
      case "card":
        return { width: 360, height: 200 };
      default:
        return { width: 172, height: 36 }; // circle fallback
    }
  };

  nodes.forEach((node) => {
    const { width, height } = getNodeSize(node.type);
    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const isHorizontal = direction === "LR";

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? "left" : "top";
    node.sourcePosition = isHorizontal ? "right" : "bottom";

    // Centering the node since dagre returns top-left corner
    const { width, height } = getNodeSize(node.type);
    node.position = {
      x: nodeWithPosition.x - width / 2,
      y: nodeWithPosition.y - height / 2,
    };

    return node;
  });
};
