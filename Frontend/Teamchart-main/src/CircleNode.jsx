import React, { useState, useRef, useEffect } from "react";
import { Handle, Position } from "reactflow";
import TooltipPortal from "./ToolTipPortal"; // 👈
import { FaTasks, FaUser } from "react-icons/fa";


export default function CircleNode({ data }) {
  const nodeRef = useRef(null);
  const [hoverPos, setHoverPos] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (nodeRef.current && nodeRef.current.contains(e.target)) {
        const rect = nodeRef.current.getBoundingClientRect();
        setHoverPos({
          top: rect.top - 60,
          left: rect.left + rect.width / 2,
        });
      } else {
        setHoverPos(null);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={nodeRef}
      className="flex items-center justify-center w-[60px] h-[60px] rounded-full"
      style={{
        backgroundColor: "#e5e7eb",
        border: "2px solid #9ca3af",
      }}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      {hoverPos && (
        <TooltipPortal style={{ top: hoverPos.top, left: hoverPos.left, transform: "translateX(-50%)" }}>
          <div className="px-3 py-2 bg-black text-white text-xs rounded-md shadow-md whitespace-nowrap">
            <div className="flex items-start gap-2 mb-1">
              <FaTasks className="mt-[2px] text-yellow-400" />
              <span><strong>Task:</strong> {data.task}</span>
            </div>
            <div className="flex items-start gap-2">
              <FaUser className="mt-[2px] text-green-400" />
              <span><strong>Assigned:</strong> {data.assignedTo}</span>
            </div>
            <div className="mt-1">
              <strong>Status:</strong> {data.status}
            </div>
          </div>
        </TooltipPortal>
      )}
    </div>
  );
}
