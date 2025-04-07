import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const SettingSection = ({ 
    icon: Icon, 
    title, 
    children, 
    darkMode,
    isCollapsible = false,
    defaultExpanded = true,
    onToggle
}) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    // Styles dynamiques avec transitions
    const containerStyle = {
        backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.7)' : 'rgba(255, 255, 255, 0.9)',
        borderColor: darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.8)',
        transition: 'all 0.3s ease-in-out'
    };

    const titleColor = darkMode ? 'text-gray-100' : 'text-gray-800';
    const iconColor = darkMode ? 'text-indigo-400' : 'text-indigo-600';
    const contentColor = darkMode ? 'text-gray-300' : 'text-gray-700';

    const handleToggle = () => {
        if (isCollapsible) {
            const newState = !isExpanded;
            setIsExpanded(newState);
            if (onToggle) onToggle(newState);
        }
    };

    return (
        <motion.div
            className={`backdrop-filter backdrop-blur-lg border rounded-xl shadow-lg overflow-hidden mb-6 transition-all duration-300 ${
                isCollapsible ? 'cursor-pointer hover:bg-opacity-90' : ''
            }`}
            style={containerStyle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: isCollapsible ? 1.01 : 1 }}
        >
            <div 
                className={`flex items-center justify-between p-6 ${isCollapsible ? 'pb-4' : 'pb-6'}`}
                onClick={handleToggle}
            >
                <div className="flex items-center">
                    <Icon 
                        className={`${iconColor} mr-4 transition-colors duration-200`} 
                        size={24} 
                    />
                    <h2 className={`text-xl font-semibold ${titleColor} transition-colors duration-200`}>
                        {title}
                    </h2>
                </div>
                {isCollapsible && (
                    <motion.div
                        animate={{ rotate: isExpanded ? 0 : 180 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronUp 
                            className={`${iconColor} transition-colors duration-200`} 
                            size={20} 
                        />
                    </motion.div>
                )}
            </div>

            <motion.div
                className={`px-6 transition-colors duration-200 ${contentColor}`}
                initial={isCollapsible ? { 
                    height: defaultExpanded ? 'auto' : 0,
                    opacity: defaultExpanded ? 1 : 0.8
                } : {}}
                animate={isCollapsible ? { 
                    height: isExpanded ? 'auto' : 0,
                    opacity: isExpanded ? 1 : 0.8
                } : {}}
                transition={{ duration: 0.2 }}
            >
                <div className={`pb-6 ${isCollapsible ? 'pt-0' : 'pt-2'}`}>
                    {(!isCollapsible || isExpanded) && children}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default function ThemedSettingSection(props) {
    const { darkMode } = useTheme();
    return <SettingSection darkMode={darkMode} {...props} />;
}