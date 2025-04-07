import { Lock } from "lucide-react";
import SettingSection from "./SettingSection";
import ToggleSwitch from "./ToggleSwitch";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const Security = () => {
    const { darkMode } = useTheme();
    const [twoFactor, setTwoFactor] = useState(false);

    // Classes dynamiques
    const buttonClasses = `font-bold py-2 px-4 rounded transition duration-200 ${
        darkMode 
            ? 'bg-indigo-600 hover:bg-indigo-700' 
            : 'bg-indigo-500 hover:bg-indigo-600'
    } text-white`;

    return (
        <SettingSection icon={Lock} title="Security" darkMode={darkMode}>
            <ToggleSwitch
                label="Two-Factor Authentication"
                isOn={twoFactor}
                onToggle={() => setTwoFactor(!twoFactor)}
                darkMode={darkMode}
            />
            <div className='mt-4'>
                <button className={buttonClasses}>
                    Change Password
                </button>
            </div>
        </SettingSection>
    );
};

export default Security;