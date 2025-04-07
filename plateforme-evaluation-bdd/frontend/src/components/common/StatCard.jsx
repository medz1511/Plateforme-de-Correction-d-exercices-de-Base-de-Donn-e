import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

const StatCard = ({ name, icon: Icon, value, color, darkMode }) => {
  const cardStyle = {
    backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(255, 255, 255, 0.7)',
    borderColor: darkMode ? '#374151' : '#e5e7eb',
  };

  const hoverStyle = {
    y: -5,
    boxShadow: darkMode 
      ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" 
      : "0 25px 50px -12px rgba(0, 0, 0, 0.1)"
  };

  return (
    <motion.div
      className="overflow-hidden rounded-xl backdrop-blur-md shadow-lg"
      style={cardStyle}
      whileHover={hoverStyle}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="px-4 py-5 sm:p-6">
        <span className={`flex items-center text-sm font-medium ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <Icon size={20} className="mr-2" style={{ color }} />
          {name}
        </span>
        <p className={`mt-1 text-3xl font-semibold ${
          darkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          {value}
        </p>
      </div>
    </motion.div>
  );
};

export default StatCard;