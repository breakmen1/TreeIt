import React from "react";
import { Handle, Position } from "reactflow";

export default function CircleNode({ data }) {
  return (
    <div
      className="group relative flex items-center justify-center w-[60px] h-[60px] rounded-full text-white font-bold"
      style={{
        backgroundColor: data.color || "#999",
        border: "2px solid black",
      }}
    >
      {data.label}

      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 px-2 py-1 bg-black text-white text-xs rounded hidden group-hover:block whitespace-nowrap z-10">
        {data.description || "No description"}
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
