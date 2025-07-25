import React, { useCallback } from "react";
import { useReactFlow } from "reactflow";
import {layoutNodesWithDagre} from "./DagreLayoutHelper";
import api from "./BaseAPI";

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}) {

  const { getNode, setNodes, addNodes, setEdges, getNodes, getEdges, fitView } = useReactFlow();

  const applyAutoLayout = () => {
    const currentNodes = getNodes();
    const currentEdges = getEdges();
    const layouted = layoutNodesWithDagre(currentNodes, currentEdges, "LR"); // or "LR"
    setNodes(layouted);

    setTimeout(() => {
      fitView({ padding: 0.3, includeHiddenNodes: true });
    }, 100); // delay to ensure layout is applied
  };


  const deleteNode = useCallback(() => {
    const deletedNode = api.post(`/nodes/${id}/deleteNode`);
    // const responseStr = api.post(`/nodes/${id}/deleteEdges`);
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);

  return (
    <div
      style={{ top, left, right, bottom }}
      className="absolute z-10 bg-white border rounded-md shadow-xl outline"
      {...props}
    >
      <p style={{ margin: "0.5em" }}>
        <small>node: {id}</small>
      </p>
      <button
        onClick={deleteNode}
        className="hover:bg-slate-200 bg-slate-100 block p-[0.5em] text-left w-[100%]"
      >
        <small>Delete</small>
      </button>

      <button
        onClick={applyAutoLayout}
        className="hover:bg-slate-200 bg-slate-100 block p-[0.5em] text-left w-[100%]"
      >
        <small>Auto layout</small>
      </button>

    </div>
  );
}
