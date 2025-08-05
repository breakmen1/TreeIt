// node/CardNode.jsx
import React, { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import { FaUser } from "react-icons/fa";

export default function CardNode({ data }) {
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
        <div className="w-[260px] p-3 bg-white rounded-xl shadow-md border border-gray-200">
            {/* Handles for connection */}
            <Handle type="target" position={Position.Left} style={{ background: "#000", width: 8, height: 8 }} />
            <Handle type="source" position={Position.Right} style={{ background: "#000", width: 8, height: 8 }} />

            {/* Header */}
            <div className="text-xs text-gray-500 flex justify-between mb-1">
                <span>Assigned to</span>
                <span>{data.assignedTo}</span>
            </div>

            {/* Status with emoji */}
            <div className="text-xs text-gray-500 flex justify-between mb-1">
                <span>Status</span>
                <span className="flex items-center gap-1">
                    <span className="capitalize">{data.status}</span>
                    {data.status === "completed" && <span>✅</span>}
                    {data.status === "pending" && <span>🕓</span>}
                    {data.status === "stuck" && <span>⚠️</span>}
                </span>
            </div>


            {/* Task */}
            <div className="font-semibold text-sm text-gray-800 truncate mb-2">
                {data.task}
            </div>

            {/* Progress bar */}
            {/* Progress bar with dynamic color */}
            {data.deadline && (
                <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full ${progress > 90
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


            <div className="text-right text-[10px] text-gray-500 mt-1">
                {progress}% time passed
            </div>
        </div>
    );
}
