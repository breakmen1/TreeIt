import React, { useCallback, useState, useEffect, useRef, useMemo, } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  updateEdge,
  useReactFlow,
  getRectOfNodes,
  getTransformForBounds,
  MarkerType,
  BaseEdge,
  getBezierPath,
} from "reactflow";

import CircleNode from "./node/Node";
import RightsidePanel from "./RightsidePanel";
import NodeProperties from "./node/NodeRightClick";
import Nodecard from "./node/Nodecard";
import RectangularNode from "./node/RectangularNode";

import { v4 as uuidv4 } from "uuid";
import { toPng } from "html-to-image";

import api from "./utility/BaseAPI";
import { useGlobalContext } from "./utility/SidebarSlide";
import { showError, showSuccess, showInfo } from "./utility/ToastNotofication";

import "reactflow/dist/style.css";
import 'react-quill/dist/quill.snow.css';

const imageWidth = 1024;
const imageHeight = 768;
const nodeTypes = {
  circle: CircleNode,
  card: RectangularNode
};

function downloadImage(dataUrl) {
  const a = document.createElement("a");

  a.setAttribute("download", "flowchart.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

const Content = ({ selectedProjectId }) => {
  const { getNodes } = useReactFlow();
  const ref = useRef(null);
  // States Start
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [id, setId] = useState(0);
  const [projectMembers, setProjectMembers] = useState([]);
  const { isSidebarOpen, closeSidebar } = useGlobalContext();
  const [selectedNode, setSelectedNode] = useState(null);
  const [newNodeInput, setNewNodeInput] = useState({
    id: "",
    task: "",
    assignedTo: "",
    deadline: new Date(),
    color: "#ffffff",
  });
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [nodeId, setNodeId] = useState();
  const [nodeName, setNodeName] = useState();
  const [nodeDescription, setNodeDescription] = useState("");
  const [description, setDescription] = useState('');
  const [nodeColor, setNodeColor] = useState("#ffffff");
  const [isCompleted, setIsCompleted] = useState(false);
  const [status, setStatus] = useState("");
  const [edges, setEdges, onEdgesChange] = useEdgesState([{ id: "e1-2", source: "1", target: "2" }]);
  const edgeUpdateSuccessful = useRef(true);
  const [showModal, setShowModal] = useState(false);
  const [menu, setMenu] = useState(null);
  const [todos, setTodos] = useState([]);
  // States End

  // UseEffects Start
  useEffect(() => {
    const fetchProjectMembers = async () => {
      if (!selectedProjectId) return;

      try {
        const res = await api.get(`/projects/${selectedProjectId}/members`);
        console.log("project refetch happened")
        setProjectMembers(res.data);
      } catch (err) {
        console.error("Failed to fetch project members:", err);
      }
    };

    fetchProjectMembers();
  }, [selectedProjectId]);

  useEffect(() => {
    const fetchGraphData = async () => {
      if (!selectedProjectId) return;

      try {
        console.log("calling backend");
        const res = await api.get(`/load/${selectedProjectId}`);
        const backendNodes = res.data.nodes.map((node) => ({
          id: node.graphNodeId.toString(),
          position: { x: node.posX, y: node.posY },
          type: node.type || "card", // change this to "card" to use CardNode
          data: {
            projectId: node.projectId,
            task: node.task,
            assignedTo: node.assignedTo,
            assignedBy: node.assignedBy,
            creatorId: node.creatorId,
            createdTime: node.createdTime,
            deadline: node.deadline,
            status: node.status,
          },
        }));

        const backendEdges = res.data.edges.map((edge) => ({
          id: edge.graphEdgeId?.toString() || `e${edge.source}-${edge.target}`,
          source: edge.source.toString(),
          target: edge.target.toString(),
        }));

        console.log("nodes from backend" + res.data.nodes);
        setNodes(enhanceNodesWithStatusHandler(backendNodes));
        setEdges(backendEdges);
      } catch (err) {
        console.error("❌ Failed to fetch graph data", err);
      }
    };

    fetchGraphData();
  }, [selectedProjectId]); // 👈 refetch when selected project changes
  // UseEffects End

  // Reactflow inbuilt start
  const getId = useCallback(() => {
    setId((prevId) => prevId + 1);
    return `node_${id}`;
  }, [id]);

  const onNodeContextMenu = useCallback(
    (event, node) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY - 60,
        left:
          event.clientX < pane.width - 200 &&
          (isSidebarOpen ? event.clientX - 300 : event.clientX),
        right:
          event.clientX >= pane.width - 200 &&
          pane.width - (isSidebarOpen ? event.clientX - 300 : event.clientX),
        bottom:
          event.clientY >= pane.height - 200 &&
          pane.height - event.clientY + 70,
      });
    },
    [setMenu, isSidebarOpen]
  );

  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) => {
      edgeUpdateSuccessful.current = true;
      setEdges((els) => updateEdge(oldEdge, newConnection, els));
    },
    [setEdges]
  );

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdateEnd = useCallback(
    (_, edge) => {
      if (!edgeUpdateSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }

      edgeUpdateSuccessful.current = true;
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
        style: {
          background: "#ffffff",
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, getId, setNodes]
  );

  const handleDownload = () => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const nodesBounds = getRectOfNodes(getNodes());
    const transform = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2
    );

    toPng(document.querySelector(".react-flow__viewport"), {
      backgroundColor: "#eef",
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then(downloadImage);
  };
  // Reactflow inbuilt end

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  const handleCreateNode = async () => {
    const task = newNodeInput.task.trim();
    if (task === "") {
      showError("Task is mandatory");
      return;
    }
    if (!newNodeInput.assignedTo) {
      showError("Please select a member before creating the node.");
      return;
    }
    if (new Date(newNodeInput.deadline) < new Date()) {
      showError("Your deadline has passed before creation, please select new deadline");
      return;
    }

    const memberId = localStorage.getItem("memberId");
    const assignedBy = localStorage.getItem("username");

    const newNode = {
      id: uuidv4(),
      position: { x: 100, y: 100 },
      type: "card",
      data: {
        projectId: selectedProjectId,
        task: newNodeInput.task,
        assignedTo: newNodeInput.assignedTo,
        creatorId: memberId,
        assignedBy: assignedBy,
        createdTime: new Date().toISOString(),
        deadline: newNodeInput.deadline || new Date().toISOString(), // default now
        status: "unpicked",
        description: description,
        onStatusChange: (newStatus) => {
          setNodes((prevNodes) =>
            prevNodes.map((n) =>
              n.id === newNode.id
                ? { ...n, data: { ...n.data, status: newStatus } }
                : n
            )
          );
        },
      },
    };
    const updatedNodes = [...nodes, newNode]; // use current state + new node
    setNodes(updatedNodes);
    setNewNodeInput({ id: "", assignedTo: "", task: "", deadline: new Date().toISOString(), name: "", color: "#ffffff" });
    await saveGraphNoAlert(updatedNodes, edges);
    showSuccess('Node created');
  };

  const saveGraphNoAlert = async (nodesArg, edgesArg) => {
    const formattedNodes = nodesArg.map((node) => ({
      graphNodeId: node.id, // 👈 pass ID from React Flow node
      projectId: node.data.projectId,
      task: node.data.task,
      assignedTo: node.data.assignedTo,
      creatorId: node.data.creatorId,
      assignedBy: node.data.assignedBy,
      createdTime: node.data.createdTime, // <-- ADD THIS
      assignedAt: new Date().toISOString(), // if needed
      deadline: node.data.deadline,
      status: node.data.status,
      posX: node.position.x,
      posY: node.position.y,
    }));
    const formattedEdges = edgesArg.map((edge) => ({
      graphEdgeId: edge.id, // 👈 use same ID from frontend
      projectId: selectedProjectId,
      source: edge.source,
      target: edge.target,
    }));

    await api.post(`/save`, {
      nodes: formattedNodes,
      edges: formattedEdges,
    });

    setDescription("");
  };

  const saveGraph = async () => {
    await saveGraphNoAlert(nodes, edges);
    showSuccess("Graph saved!");
  };

  const filteredNodes = useMemo(() => {
    return nodes.filter(
      (node) => `${node.data.projectId}` == `${selectedProjectId}`
    );
  }, [nodes, selectedProjectId]);

  const enhanceNodesWithStatusHandler = (nodes) => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onStatusChange: (newStatus) => {
          setNodes((prevNodes) =>
            prevNodes.map((n) =>
              n.id === node.id
                ? {
                  ...n,
                  data: {
                    ...n.data,
                    status: newStatus,
                  },
                }
                : n
            )
          );
        },
      },
    }));
  };

  // Handle node click
  const onNodeClick = useCallback(async (event, node) => {
    setSelectedNode(node);
    setNodeName(node.data.task);
    setNodeId(node.id);
    setNodeColor("transparent");
    setStatus(node.data.status || "");

    try {
      const res = await api.get(`/nodes/${node.id}/todos`);
      const data = res.data; // Axios gives parsed response here

      setTodos(data);
      setNodeDescription(node.data.description || ""); // fallback
      console.log("description is -->" + node.data.description);
      setIsCompleted(node.data.status === "COMPLETED");
      setShowModal(true);
    } catch (error) {
      console.error("Failed to fetch todos", error);
    }
  }, []);

  const onToggleTodo = async (todoId) => {
    await api.post(`/todos/${todoId}/toggle`);
    const res = await api.get(`/nodes/${nodeId}/todos`);
    setTodos(res.data); // No need for res.json() if you're using axios
  };

  const onMarkCompleted = async () => {
    try {
      await api.post(`/nodes/${nodeId}/complete`);
      setIsCompleted(true);
      setNodeColor("green");
      setShowModal(false);
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, status: "completed" } }
            : node
        )
      );
      showSuccess("Node marked as completed successfully!");
    } catch (error) {
      // If error response is from backend, show an alert
      if (error.response && error.response.data) {
        showError(
          error.response.data.message ||
          "All todos must be completed before marking as completed."
        );
      } else {
        showError("Something went wrong. Please try again.");
      }
    }
  };

  const onAddTodo = async (newTask) => {
    const localMemberId = localStorage.getItem("memberId");
    await api.post(`/nodes/${nodeId}/todos`, {
      task: newTask,
      memberId: localMemberId,
    });
    const res = await api.get(`/nodes/${nodeId}/todos`);
    setTodos(res.data);
    showSuccess("Added new todo");

  };

  const onStatusChange = (newStatus) => {
    if (!nodeId) return;

    const currentUsername = localStorage.getItem("username");
    const node = nodes.find((n) => n.id === nodeId);

    if (!node) {
      showError("Node not found.");
      return;
    }

    if (node.data.assignedTo !== currentUsername) {
      showError("You are not assigned to this node and cannot update its status.");
      return;
    }

    const colorMap = {
      pending: "#3b82f6",
      stuck: "#facc15",
      completed: "green",
    };

    setNodeColor(colorMap[newStatus] || "#ffffff");
    setStatus(newStatus);

    setNodes((prevNodes) =>
      prevNodes.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, status: newStatus } }
          : n
      )
    );
  };

  const edgeStyle = {
    type: 'bezier',
    animated: true,
    style: {
      stroke: 'black',
      strokeWidth: 2,
      filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))',
      strokeDasharray: '5 5',
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: 'black',
    },
  };

  const customEdgeLine = ({ fromX, fromY, toX, toY }) => {
    const [edgePath] = getBezierPath({
      sourceX: fromX,
      sourceY: fromY,
      targetX: toX,
      targetY: toY,
    });

    return (
      <path
        d={edgePath}
        stroke="blue"
        strokeWidth={2}
        fill="none"
        style={{ strokeDasharray: '5 5' }}
      />
    );
  };

  const onDeadlineChange = async (newDeadline) => {
    try {
      await api.post(`/nodes/${nodeId}/update-deadline`, { deadline: newDeadline });
      setNodes((prevNodes) =>
        prevNodes.map((n) =>
          n.id === nodeId
            ? {
              ...n,
              data: {
                ...n.data,
                deadline: newDeadline,
              },
            }
            : n
        )
      );
    } catch (err) {
      console.error("Error updating deadline:", err);
      throw err;
    }
  }

  return (
    <ReactFlow
      ref={ref}
      nodes={filteredNodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      onInit={setReactFlowInstance}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onEdgeUpdate={onEdgeUpdate}
      onEdgeUpdateStart={onEdgeUpdateStart}
      onEdgeUpdateEnd={onEdgeUpdateEnd}
      defaultEdgeOptions={edgeStyle}
      connectionLineComponent={customEdgeLine}
      onPaneClick={onPaneClick}
      onNodeContextMenu={onNodeContextMenu}
      nodeTypes={nodeTypes}
    >
      {/* Rightside panel */}
      <RightsidePanel
        isSidebarOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
        projectMembers={projectMembers}
        newNodeInput={newNodeInput}
        setNewNodeInput={setNewNodeInput}
        description={description}
        setDescription={setDescription}
        handleCreateNode={handleCreateNode}
        saveGraph={saveGraph}
        onClick={handleDownload}
      />

      <Controls />
      <MiniMap zoomable pannable />
      <Background variant="lines" gap={30} color="#aaa" lineWidth={0.3} />

      {/* node properties on right click */}
      {menu && <NodeProperties onClick={onPaneClick} {...menu} />}

      <Nodecard
        show={showModal}
        onClose={() => setShowModal(false)}
        nodeName={nodeName}
        description={nodeDescription}
        todos={todos}
        isCompleted={isCompleted}
        assignedTo={selectedNode?.data.assignedTo}
        creatorId={selectedNode?.data.creatorId}
        onToggleTodo={onToggleTodo}
        onMarkCompleted={onMarkCompleted}
        onAddTodo={onAddTodo}
        status={status}
        onStatusChange={onStatusChange}
        nodeData={selectedNode?.data}
        onDeadlineChange={onDeadlineChange}
      />
    </ReactFlow>
  );
};

const ReactFlowProviderContent = ({ selectedProjectId }) => {
  const { isSidebarOpen } = useGlobalContext();

  return (
    <ReactFlowProvider>
      <div
        className={`flex flex-col h-[calc(97vh-74px)] overflow-x-hidden ${isSidebarOpen ? "mr-64" : ""
          }`}
      >
        <Content selectedProjectId={selectedProjectId} />
      </div>
    </ReactFlowProvider>

  );
};

export default ReactFlowProviderContent;