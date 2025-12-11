import React from "react";
import { motion } from "framer-motion";

export default function StatsCard({
  label,
  value,
  hovered,
}: {
  label: string;
  value: number;
  hovered: boolean;
}) {
  return (
    <motion.div
      className="bg-white rounded-xl p-5 shadow-sm"
      animate={{
        scale: hovered ? 1.05 : 1,
        zIndex: hovered ? 10 : 1,
        boxShadow: hovered
          ? "0 20px 30px rgba(0,0,0,0.15)"
          : "0 4px 6px rgba(0,0,0,0.1)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </motion.div>
  );
}
