import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import SettingSection from "./SettingSection";
import { Bell } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";

const Notifications = () => {
    const { darkMode } = useTheme();
    const [notifications, setNotifications] = useState({
        push: true,
        email: false,
        sms: true,
    });

    const toggleNotification = (type) => {
        setNotifications(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    return (
        <SettingSection 
            icon={Bell} 
            title="Notifications"
            darkMode={darkMode}
        >
            <div className="space-y-4">
                <ToggleSwitch
                    label="Push Notifications"
                    isOn={notifications.push}
                    onToggle={() => toggleNotification('push')}
                    darkMode={darkMode}
                />
                <ToggleSwitch
                    label="Email Notifications"
                    isOn={notifications.email}
                    onToggle={() => toggleNotification('email')}
                    darkMode={darkMode}
                />
                <ToggleSwitch
                    label="SMS Notifications"
                    isOn={notifications.sms}
                    onToggle={() => toggleNotification('sms')}
                    darkMode={darkMode}
                />
            </div>
        </SettingSection>
    );
};

export default Notifications;