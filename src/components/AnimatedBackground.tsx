"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-brand-dark-bg">
      {/* Radial grid pan overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.25] pointer-events-none" />

      {/* Vignette radial overlay for focus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,11,0.85)_80%)]" />

      {/* Floating ambient light blobs */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-brand-purple/10 blur-[80px] pointer-events-none"
      />

      <motion.div
        animate={{
          x: [0, -30, 50, 0],
          y: [0, 40, -40, 0],
          scale: [1, 0.9, 1.2, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-brand-indigo/10 blur-[100px] pointer-events-none"
      />

      <motion.div
        animate={{
          x: [0, 60, -30, 0],
          y: [0, 30, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 right-1/3 h-[300px] w-[300px] rounded-full bg-brand-cyan/5 blur-[90px] pointer-events-none"
      />
    </div>
  );
}
