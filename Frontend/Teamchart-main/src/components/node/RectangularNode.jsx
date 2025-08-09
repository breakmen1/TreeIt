import React, { useEffect, useState, useCallback } from "react";
import { Handle, Position } from "reactflow";
import { FaUser, FaComment } from "react-icons/fa";
import { FaCheckCircle, FaClock, FaExclamationTriangle, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";

export default function RectangularNode({ data }) {
    const [progress, setProgress] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    const updateProgress = useCallback(() => {
        if (!data.createdTime || !data.deadline) return;

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
    }, [data.createdTime, data.deadline]);

    useEffect(() => {
        if (!data.createdTime || !data.deadline) return;

        updateProgress(); // Call once immediately
        const interval = setInterval(updateProgress, 60000); // Update every 1 min

        return () => clearInterval(interval);
    }, [data.createdTime, data.deadline, updateProgress]);

    // Determine card border color based on status
    const getBorderClass = () => {
        switch (data.status) {
            case "completed":
                return "border-t-4 border-t-green-500";
            case "stuck":
                return "border-t-4 border-t-red-500";
            case "pending":
                return "border-t-4 border-t-blue-500";
            case "unpicked":
            default:
                return "border-t-4 border-t-gray-400"; // Grey for unpicked or any other status
        }
    };

    // Get status icon with animation
    const getStatusIcon = () => {
        switch(data.status) {
            case "completed":
                return <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                    <FaCheckCircle className="text-green-500 text-sm" />
                </motion.div>;
            case "pending":
                return <motion.div animate={{ rotate: [0, 15, 0, -15, 0] }} transition={{ repeat: Infinity, duration: 5 }}>
                    <FaClock className="text-blue-500 text-sm" />
                </motion.div>;
            case "stuck":
                return <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <FaExclamationTriangle className="text-yellow-500 text-sm" />
                </motion.div>;
            default:
                return <FaClock className="text-gray-400 text-sm" />;
        }
    };

    return (
        <motion.div
            className={`w-[260px] p-3 bg-white rounded-xl shadow-md border border-gray-200 relative ${getBorderClass()} hover:shadow-lg`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
            {/* Handles for connection with animation */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0.5 }}
                transition={{ duration: 0.2 }}
            >
                <Handle 
                    type="target" 
                    position={Position.Left} 
                    style={{ background: "#000", width: 8, height: 8 }} 
                />
                <Handle 
                    type="source" 
                    position={Position.Right} 
                    style={{ background: "#000", width: 8, height: 8 }} 
                />
            </motion.div>

            {/* Priority indicator with animation */}
            {data.priority && (
                <motion.div 
                    className={`absolute -top-2 -left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${
                        data.priority === "high" ? "bg-red-500" : 
                        data.priority === "medium" ? "bg-orange-500" : "bg-blue-500"
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                    {data.priority}
                </motion.div>
            )}

            {/* Header with subtle hover effect */}
            <div className="text-xs text-gray-500 flex justify-between mb-1 group">
                <span className="transition-colors duration-200 group-hover:text-gray-700">Assigned to</span>
                <span className="font-medium transition-colors duration-200 group-hover:text-blue-600">{data.assignedTo}</span>
            </div>

            <div className="text-xs text-gray-500 flex justify-between mb-1 group">
                <span className="transition-colors duration-200 group-hover:text-gray-700">Assigned by</span>
                <span className="font-medium transition-colors duration-200 group-hover:text-blue-600">{data.assignedBy}</span>
            </div>

            {/* Status with animated icons */}
            <div className="text-xs text-gray-500 flex justify-between mb-1">
                <span>Status</span>
                <span className="flex items-center gap-1">
                    {getStatusIcon()}
                    <motion.span 
                        className="capitalize font-medium"
                        initial={{ x: -5, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        {data.status}
                    </motion.span>
                </span>
            </div>

            {/* Task with highlight effect */}
            {data.task && (
                <motion.div 
                    className="text-sm font-bold text-gray-700 mb-2 break-words"
                    whileHover={{ color: "#3b82f6" }}
                    transition={{ duration: 0.2 }}
                >
                    {data.task}
                </motion.div>
            )}

            {/* Description with reveal effect */}
            {data.description && (
                <motion.div 
                    className="text-xs text-gray-600 mb-2 line-clamp-2 overflow-hidden"
                    initial={{ height: "0" }}
                    animate={{ height: "auto" }}
                    transition={{ duration: 0.3 }}
                >
                    {data.description}
                </motion.div>
            )}

            {/* Deadline date display with hover effect */}
            {data.deadline && (
                <motion.div 
                    className="flex items-center text-xs text-gray-500 mb-1 group"
                    whileHover={{ x: 2 }}
                >
                    <FaCalendarAlt className="mr-1 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                    <span>Due: {formatDate(data.deadline)}</span>
                </motion.div>
            )}

            {/* Progress bar with animation */}
            {data.status !== "completed" && data.deadline && (
                <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{progress}% time passed</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                            className={`h-2.5 rounded-full ${
                                progress > 90 ? "bg-red-500" : 
                                progress > 70 ? "bg-orange-400" : "bg-green-500"
                            }`}
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </div>
                </div>
            )}

            {/* Comments indicator with animation */}
            {data.comments && data.comments.length > 0 && (
                <motion.div 
                    className="mt-2 text-xs text-gray-500 flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <FaComment className="mr-1 text-gray-400" />
                    <span>{data.comments.length} comment{data.comments.length !== 1 ? 's' : ''}</span>
                </motion.div>
            )}
        </motion.div>
    );
}
