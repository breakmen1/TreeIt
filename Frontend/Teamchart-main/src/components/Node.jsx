import React, { useState, useRef, useEffect } from "react";
import { Handle, Position } from "reactflow";
import { FaTasks, FaUser } from "react-icons/fa";

export default function CircleNode({ data }) {
  const nodeRef = useRef(null);
  const [hoverPos, setHoverPos] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);

  const getRemainingTime = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;

    if (diff <= 0) return "Past due";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const min = Math.floor((diff / (1000 * 60)) % 60);

    return ` ${days}d ${hours}h ${min}m `;
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current); // prevent early hide
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 500); // ⏱ keep tooltip for 3 seconds
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (nodeRef.current && nodeRef.current.contains(e.target)) {
        const rect = nodeRef.current.getBoundingClientRect();
        setHoverPos({
          top: rect.top - 80,
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
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={nodeRef}
        className="flex items-center justify-center w-[60px] h-[60px] rounded-full"
        style={{
          backgroundColor:
            data.status === "completed"
              ? "#4ade80" // green
              : data.status === "pending"
                ? "#60a5fa" // blue
                : data.status === "stuck"
                  ? "#f87171" // red
                  : "#e5e7eb",
          border: "2px solid #9ca3af",
        }}
      >
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </div>

      {isHovered && (
        <div className="absolute top-[-80px] left-1/2 transform -translate-x-1/2 z-50">
          <div className="px-3 py-2 bg-black text-white text-xs rounded-md shadow-md whitespace-nowrap">
            <div className="flex items-start gap-2 mb-1">
              <FaTasks className="mt-[2px] text-yellow-400" />
              <span>
                <strong>Task:</strong> {data.task}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <FaUser className="mt-[2px] text-green-400" />
              <span>
                <strong>Assigned:</strong> {data.assignedTo}
              </span>
            </div>
            <div className="mt-1">
              <strong>Remaining:</strong>{" "}
              {data.deadline ? getRemainingTime(data.deadline) : "None"}
            </div>
            <div className="mt-1">
              <label>
                <strong>Status:</strong>
                <select
                  className="ml-1 text-black rounded"
                  value={data.status}
                  onChange={(e) => {
                    data.onStatusChange?.(e.target.value);
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="stuck">Stuck</option>
                </select>
              </label>
            </div>
            <button onClick={(e) => {
              // simulate a click event with current node
              if (data.onNodeClick) {
                data.onNodeClick(e, { id: data.id, data }); // pass node ID and data
              }
            }}>click me</button>
            <div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
