import React, { useCallback, useState, useEffect, useRef, useMemo } from "react";
import CircleNode from "./Node";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
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
} from "reactflow";

import ContextMenu from "./NodeHandle";
import { toPng } from "html-to-image";
import "reactflow/dist/style.css";
import { BiSolidDockLeft } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import { useGlobalContext } from "./Sidebar";
import "reactflow/dist/style.css";

const nodeTypes = {
  circle: CircleNode,
};

const initialNodes = [];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

function downloadImage(dataUrl) {
  const a = document.createElement("a");

  a.setAttribute("download", "flowchart.png");
  a.setAttribute("href", dataUrl);
  a.click();
}
const imageWidth = 1024;
const imageHeight = 768;

const Content = ({ selectedProjectId }) => {
  const { isSidebarOpen, closeSidebar } = useGlobalContext();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeName, setNodeName] = useState();
  const [nodeId, setNodeId] = useState();
  const [nodeColor, setNodeColor] = useState("#ffffff");
  const [selectedElements, setSelectedElements] = useState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const edgeUpdateSuccessful = useRef(true);
  const [menu, setMenu] = useState(null);
  const ref = useRef(null);
  const [newNodeInput, setNewNodeInput] = useState({
    id: "",
    taskDescription: "",
    assignedTo: "",
    deadline: "",
    color: "#ffffff",
  });
  const { getNodes } = useReactFlow();

  const filteredNodes = useMemo(() => {
    return nodes.filter(node => `${node.data.projectId}` == `${selectedProjectId}`);
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


  const onClick = () => {
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
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  const [id, setId] = useState(0);

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

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  // Handle node click
  const onNodeClick = useCallback((event, node) => {
    setSelectedElements([node]);
    setNodeName(node.data.task);
    setNodeId(node.id);
    setNodeColor("transparent");
  }, []);
  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) => {
      edgeUpdateSuccessful.current = true;
      setEdges((els) => updateEdge(oldEdge, newConnection, els));
    },
    [setEdges]
  );

  const onEdgeUpdateEnd = useCallback(
    (_, edge) => {
      if (!edgeUpdateSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }

      edgeUpdateSuccessful.current = true;
    },
    [setEdges]
  );

  const handleCreateNode = () => {
    const newNode = {
      id: uuidv4(),
      position: { x: 100, y: 100 },
      type: "circle",
      data: {
        projectId: selectedProjectId,
        task: newNodeInput.taskDescription,
        assignedTo: newNodeInput.assignedTo,
        deadline: newNodeInput.deadline || new Date().toISOString(), // default now
        status: "unpicked",
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


    setNodes((prevNodes) => [...prevNodes, newNode]);
    setNewNodeInput({ id: "", name: "", color: "#ffffff" });
  };

  useEffect(() => {
    const fetchGraphData = async () => {
      if (!selectedProjectId) return;

      try {
        console.log("calling backend");
        const res = await axios.get(`http://localhost:2999/load/${selectedProjectId}`);

        const backendNodes = res.data.nodes.map((node) => ({
          id: node.graphNodeId.toString(),
          position: { x: node.posX, y: node.posY },
          type: "circle",
          data: {
            projectId: node.projectId,
            task: node.task,
            assignedTo: node.assignedTo,
            deadline: node.deadline,
            status: node.status,
          },
        }));

        const backendEdges = res.data.edges.map((edge) => ({
          id: edge.graphEdgeId?.toString() || `e${edge.source}-${edge.target}`,
          source: edge.source.toString(),
          target: edge.target.toString(),
        }));

        console.log('nodes from backend' + backendNodes);
        setNodes(enhanceNodesWithStatusHandler(backendNodes));
        setEdges(backendEdges);

      } catch (err) {
        console.error("❌ Failed to fetch graph data", err);
      }
    };

    fetchGraphData();
  }, [selectedProjectId]); // 👈 refetch when selected project changes

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

  const saveGraph = async () => {
    const formattedNodes = nodes.map((node) => ({
      graphNodeId: node.id, // 👈 pass ID from React Flow node
      projectId: node.data.projectId,
      task: node.data.task,
      assignedTo: node.data.assignedTo,
      assignedAt: new Date().toISOString(), // if needed
      deadline: node.data.deadline,
      status: node.data.status,
      posX: node.position.x,
      posY: node.position.y,
    }));

    const formattedEdges = edges.map((edge) => ({
      graphEdgeId: edge.id, // 👈 use same ID from frontend
      projectId: 1,
      source: edge.source,
      target: edge.target,
    }));

    await axios.post("http://localhost:2999/save", {
      nodes: formattedNodes,
      edges: formattedEdges,
    });

    alert("Graph saved!");
  };

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
      onPaneClick={onPaneClick}
      onNodeContextMenu={onNodeContextMenu}
      nodeTypes={nodeTypes}
    >
      {/* sidebar */}
      <div
        className={`transition-all  duration-500  fixed top-0 ${isSidebarOpen ? "right-0" : "-right-64"
          }`}
      >
        <div className="relative flex flex-col w-64 h-screen min-h-screen px-4 py-8 overflow-y-auto bg-white border-r">
          <div className="">
            <button
              onClick={closeSidebar}
              className="absolute flex items-center justify-center w-8 h-8 ml-6 text-gray-600 rounded-full top-1 right-1">
              {/* <HiX className="w-5 h-5" /> */}
              <BiSolidDockLeft className="w-5 h-5" />
            </button>
            <h2 className="text-3xl font-semibold text-gray-700 ">
              Task <span className="-ml-1 text-pink-500 ">It</span>
            </h2>
          </div>
          <hr className="my-0 mt-[0.20rem]" />
          <div className="flex flex-col justify-between flex-1 mt-3">
            <div className="flex flex-col justify-start space-y-5 h-[calc(100vh-135px)]">
              {/* Create Node Section */}
              <div className="flex flex-col space-y-3 ">
                <div className="flex flex-col space-y-3">
                  <input
                    type="text"
                    placeholder="Task Description"
                    className="p-[1px] border pl-1 "
                    onChange={(e) =>
                      setNewNodeInput((prev) => ({
                        ...prev,
                        taskDescription: e.target.value,
                      }))
                    }
                    value={newNodeInput.taskDescription}
                  />

                  <input
                    type="text"
                    placeholder="Assigned to"
                    className="p-[1px] border pl-1 "
                    onChange={(e) =>
                      setNewNodeInput((prev) => ({
                        ...prev,
                        assignedTo: e.target.value,
                      }))
                    }
                    value={newNodeInput.assignedTo}
                  />

                  <input
                    type="datetime-local"
                    placeholder="Deadline"
                    className="p-[1px] border pl-1"
                    value={newNodeInput.deadline}
                    onChange={(e) =>
                      setNewNodeInput((prev) => ({
                        ...prev,
                        deadline: e.target.value,
                      }))
                    }
                  />


                  <button
                    className="p-[4px]  text-white bg-slate-700 hover:bg-slate-800 active:bg-slate-900 rounded"
                    onClick={handleCreateNode}
                  >
                    Create Node
                  </button>
                </div>
              </div>
              <hr className="my-2" />
              {/* Save and Restore Buttons */}
              <div className="flex flex-col space-y-3">
                <div className="text-lg font-bold text-black">Controls</div>
                <div className="flex flex-row space-x-3">
                  <button
                    className="flex-1 p-2 text-sm text-white transition duration-300 ease-in-out rounded bg-slate-700 hover:bg-slate-800 active:bg-slate-900"
                    onClick={saveGraph}
                  >
                    Save
                  </button>

                  <button
                    className="flex-1 p-2 text-sm text-white rounded bg-slate-700 hover:bg-slate-800 active:bg-slate-900"
                    onClick={onClick}
                  >
                    Download{" "}
                  </button>

                </div>
              </div>


              <hr className="my-0" />
              <div className="flex justify-center px-4 pb-2 mt-auto -mx-4 bottom-3">
                <h4 className=" text-[12px] font-semibold text-gray-600 ">
                  {/* Made with <FaHeart className="inline-block " /> by{" "} */}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href=""
                    className="cursor-pointer hover:underline hover:text-blue-500"
                  >
                    {/* Akash. */}
                  </a>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Controls />
      <MiniMap zoomable pannable />
      <Background variant="dots" gap={12} size={1} />
      {/* context menu */}
      {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
    </ReactFlow>
  );
};

const ReactFlowProviderContent = ({ selectedProjectId }) => {
  const { isSidebarOpen } = useGlobalContext();

  return (
    <ReactFlowProvider>
      <div
        className={`h-[calc(100vh-74px)] flex flex-col  ${isSidebarOpen ? "mr-64" : ""}`}
      >
        <Content selectedProjectId={selectedProjectId} />
      </div>
    </ReactFlowProvider>
  );
};


export default ReactFlowProviderContent;
