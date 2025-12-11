import { motion } from "framer-motion";

interface StatsCardProps {
  label: string;
  value: string | number;
  isHovered?: boolean;
}

export default function StatsCard({ label, value, isHovered }: StatsCardProps) {
  return (
    <motion.div
      className="bg-white rounded-xl p-5 shadow-sm cursor-pointer"
      animate={{
        scale: isHovered ? 1.05 : 1,
        zIndex: isHovered ? 10 : 1,
        boxShadow: isHovered
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
