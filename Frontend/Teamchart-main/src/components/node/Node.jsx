import React, { useState, useRef, useEffect } from "react";
import { Handle, Position } from "reactflow";
import ReactDOM from "react-dom";

import { FaTasks, FaUser } from "react-icons/fa";
import { FcOvertime } from "react-icons/fc";

export default function CircleNode({ data }) {

  // States Start
  const nodeRef = useRef(null);
  const timeoutRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPos, setHoverPos] = useState(null);
  // States End

  // useEffects start
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
  // useEffects End

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 500);
  };

  // Status-based gradient colors
  const statusGradient = {
    completed: "from-green-400 to-green-600",
    pending: "from-blue-400 to-blue-600",
    stuck: "from-red-400 to-red-600",
    default: "from-gray-300 to-gray-500",
  };

  const gradient =
    statusGradient[data.status] || statusGradient.default;

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

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={nodeRef}
        className={`w-[60px] h-[60px] rounded-full bg-gradient-to-br ${gradient} 
          shadow-xl border-2 border-gray-300 flex items-center justify-center 
          transition-transform duration-300 hover:scale-110`}
      >
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </div>

      {isHovered &&
        hoverPos &&
        ReactDOM.createPortal(
          <div
            className="fixed z-[9999] pointer-events-none"
            style={{
              top: `${hoverPos.top + 78}px`,
              left: `${hoverPos.left + 135}px`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="bg-white bg-opacity-90 text-black text-xs rounded-lg px-4 py-3 shadow-lg animate-fadeIn max-w-xs w-[240px] whitespace-normal text-left">
              <div className="flex items-start gap-2 mb-1">
                <FaTasks className="mt-[2px] text-yellow-400" />
                <span><strong>Task:</strong> {data.task}</span>
              </div>
              <div className="flex items-start gap-2 mb-1">
                <FaUser className="mt-[2px] text-green-400" />
                <span><strong>Assigned:</strong> {data.assignedTo}</span>
              </div>
              <div className="flex items-start gap-2 mb-1">
                <FcOvertime className="mt-[3px]" />
                <span><strong>Remaining : </strong>{data.deadline ? getRemainingTime(data.deadline) : "None"}</span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
