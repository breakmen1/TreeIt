// node/RectangularNode.jsx
import React, { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import { FaUser } from "react-icons/fa";
import { FaCheckCircle, FaClock, FaExclamationTriangle } from "react-icons/fa";

export default function RectangularNode({ data }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!data.createdTime || !data.deadline) return;

        console.log("Progress calculation:", data);

        const updateProgress = () => {
            const start = new Date(data.createdTime);
            const end = new Date(data.deadline);
            const now = new Date();

            const total = end - start;
            const elapsed = now - start;

            if (total <= 0) {
                setProgress(100); // Deadline already passed
                return;
            }

            const percent = Math.min(100, Math.max(0, (elapsed / total) * 100));
            setProgress(percent.toFixed(2));
        };

        updateProgress(); // Call once immediately
        const interval = setInterval(updateProgress, 5000); // Update every 1 min

        return () => clearInterval(interval);
    }, [data.createdTime, data.deadline]);


    return (
        <div
            className={`w-[260px] p-3 bg-white rounded-xl shadow-md border border-gray-200 relative
        ${data.status === "completed" ? "border-t-4 border-t-green-500" : ""}`}
        >
            {/* Handles for connection */}
            <Handle type="target" position={Position.Left} style={{ background: "#000", width: 8, height: 8 }} />
            <Handle type="source" position={Position.Right} style={{ background: "#000", width: 8, height: 8 }} />

            {/* Header */}
            <div className="text-xs text-gray-500 flex justify-between mb-1">
                <span>Assigned to</span>
                <span>{data.assignedTo}</span>
            </div>

            <div className="text-xs text-gray-500 flex justify-between mb-1">
                <span>Assigned by</span>
                <span>{data.assignedBy}</span>
            </div>

            {/* Status with react icons */}
            <div className="text-xs text-gray-500 flex justify-between mb-1">
                <span>Status</span>
                <span className="flex items-center gap-1">
                    {data.status === "completed" && <FaCheckCircle className="text-green-500 text-sm" />}
                    {data.status === "pending" && <FaClock className="text-blue-500 text-sm" />}
                    {data.status === "stuck" && <FaExclamationTriangle className="text-yellow-500 text-sm" />}
                    <span className="capitalize">{data.status}</span>
                </span>
            </div>

            {/* Task */}
            {data.task && (
                <div className="text-sm font-bold text-gray-700 mb-1 break-words">
                    {data.task}
                </div>
            )}

            {/* Progress bar with dynamic color */}
            {data.status !== "completed" && data.deadline && (
                <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Deadline</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className={`h-2.5 rounded-full ${progress > 90
                                ? "bg-red-500"
                                : progress > 70
                                    ? "bg-orange-400"
                                    : "bg-green-500"
                                }`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}


            {data.status !== "completed" && data.deadline && (
                <div className="text-right text-[10px] text-gray-500 mt-1">
                    {progress}% time passed
                </div>
            )}
        </div>
    );
}
