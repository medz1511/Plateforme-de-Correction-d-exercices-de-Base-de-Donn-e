import { useTheme } from "@/context/ThemeContext";

const ToggleSwitch = ({ label, isOn, onToggle }) => {
    const { darkMode } = useTheme();

    // Classes dynamiques
    const labelClasses = `text-sm ${
        darkMode ? 'text-gray-300' : 'text-gray-700'
    }`;

    const trackClasses = `relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
        isOn 
            ? (darkMode ? 'bg-indigo-600' : 'bg-indigo-500')
            : (darkMode ? 'bg-gray-600' : 'bg-gray-300')
    }`;

    const thumbClasses = `inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
        isOn ? 'translate-x-6' : 'translate-x-1'
    }`;

    return (
        <div className='flex items-center justify-between py-3'>
            <span className={labelClasses}>{label}</span>
            <button
                className={trackClasses}
                onClick={onToggle}
                aria-pressed={isOn}
                aria-label={`${label} - ${isOn ? 'On' : 'Off'}`}
            >
                <span className={thumbClasses} />
            </button>
        </div>
    );
};

export default ToggleSwitch;