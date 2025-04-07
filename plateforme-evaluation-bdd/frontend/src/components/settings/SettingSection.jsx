import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

const SettingSection = ({ icon: Icon, title, children, darkMode }) => {
    // Styles dynamiques
    const containerStyle = {
        backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(255, 255, 255, 0.7)',
        borderColor: darkMode ? '#374151' : '#e5e7eb',
    };

    const titleColor = darkMode ? 'text-gray-100' : 'text-gray-800';
    const iconColor = darkMode ? 'text-indigo-400' : 'text-indigo-600';

    return (
        <motion.div
            className="backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 mb-8"
            style={containerStyle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className='flex items-center mb-4'>
                <Icon className={`${iconColor} mr-4`} size='24' />
                <h2 className={`text-xl font-semibold ${titleColor}`}>{title}</h2>
            </div>
            <div className={darkMode ? '' : 'text-gray-700'}>
                {children}
            </div>
        </motion.div>
    );
};

export default function ThemedSettingSection(props) {
    const { darkMode } = useTheme();
    return <SettingSection darkMode={darkMode} {...props} />;
}