// src/components/Loading.js
import React from "react";
import { motion } from "framer-motion";
import "../style/Loading.css";

function Loading() {
  return (
    <div className="loading-overlay">
      <motion.div
        className="loader"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 1,
        }}
      />
    </div>
  );
}

export default Loading;
