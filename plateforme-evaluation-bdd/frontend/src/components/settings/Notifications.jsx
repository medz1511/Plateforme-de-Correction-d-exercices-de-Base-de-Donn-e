import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import SettingSection from "./SettingSection";
import { Bell, Smartphone, Mail, BellOff } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import { motion } from "framer-motion";

const Notifications = () => {
    const { darkMode } = useTheme();
    const [notifications, setNotifications] = useState({
        push: true,
        email: false,
        sms: true,
        muteAll: false
    });

    const toggleNotification = (type) => {
        // Si on active "Mute All", désactive toutes les autres notifications
        if (type === 'muteAll') {
            const newMuteState = !notifications.muteAll;
            setNotifications({
                push: !newMuteState && notifications.push,
                email: !newMuteState && notifications.email,
                sms: !newMuteState && notifications.sms,
                muteAll: newMuteState
            });
        } else {
            // Si on active une notification spécifique, désactive "Mute All"
            setNotifications(prev => ({
                ...prev,
                [type]: !prev[type],
                muteAll: false
            }));
        }
    };

    // Styles dynamiques
    const iconColor = darkMode ? "text-gray-400" : "text-gray-500";
    const dividerColor = darkMode ? "border-gray-700" : "border-gray-200";

    return (
        <SettingSection 
            icon={Bell} 
            title="Paramètres de notification"
            darkMode={darkMode}
            isCollapsible
            defaultExpanded={false}
        >
            <div className="space-y-6">
                {/* Mute All */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ToggleSwitch
                        label={
                            <div className="flex items-center">
                                <BellOff className={`mr-3 ${iconColor}`} size={18} />
                                <span>Désactiver toutes les notifications</span>
                            </div>
                        }
                        isOn={notifications.muteAll}
                        onToggle={() => toggleNotification('muteAll')}
                        size="medium"
                        withIcon={false}
                        disabled={false}
                    />
                </motion.div>

                <div className={`border-t ${dividerColor} pt-4`}></div>

                {/* Notification Channels */}
                <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: notifications.muteAll ? 0.5 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <ToggleSwitch
                        label={
                            <div className="flex items-center">
                                <Smartphone className={`mr-3 ${iconColor}`} size={18} />
                                <span>Notifications push</span>
                            </div>
                        }
                        isOn={notifications.push && !notifications.muteAll}
                        onToggle={() => toggleNotification('push')}
                        size="medium"
                        disabled={notifications.muteAll}
                    />

                    <ToggleSwitch
                        label={
                            <div className="flex items-center">
                                <Mail className={`mr-3 ${iconColor}`} size={18} />
                                <span>Notifications email</span>
                            </div>
                        }
                        isOn={notifications.email && !notifications.muteAll}
                        onToggle={() => toggleNotification('email')}
                        size="medium"
                        disabled={notifications.muteAll}
                    />

                    <ToggleSwitch
                        label={
                            <div className="flex items-center">
                                <Smartphone className={`mr-3 ${iconColor}`} size={18} />
                                <span>Notifications SMS</span>
                            </div>
                        }
                        isOn={notifications.sms && !notifications.muteAll}
                        onToggle={() => toggleNotification('sms')}
                        size="medium"
                        disabled={notifications.muteAll}
                    />
                </motion.div>

                {/* Information */}
                {notifications.muteAll && (
                    <motion.div 
                        className={`text-sm p-3 rounded-lg ${
                            darkMode ? "bg-gray-800 text-gray-300" : "bg-blue-50 text-blue-800"
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Toutes vos notifications sont actuellement désactivées.
                    </motion.div>
                )}
            </div>
        </SettingSection>
    );
};

export default Notifications;