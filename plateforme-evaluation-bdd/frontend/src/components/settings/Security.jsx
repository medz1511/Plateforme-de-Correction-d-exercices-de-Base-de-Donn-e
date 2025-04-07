import { Lock, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import SettingSection from "./SettingSection";
import ToggleSwitch from "./ToggleSwitch";
import { useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

const Security = () => {
    const { darkMode } = useTheme();
    const [twoFactor, setTwoFactor] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");

    // Classes dynamiques
    const textClasses = {
        label: `block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`,
        input: `w-full p-2.5 rounded-lg border text-sm ${
            darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
        }`,
        error: "mt-1 text-sm text-red-500",
        success: "mt-1 text-sm text-green-500"
    };

    const buttonClasses = {
        primary: `flex items-center justify-center gap-2 font-medium py-2 px-4 rounded transition duration-200 ${
            darkMode 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-indigo-500 hover:bg-indigo-600'
        } text-white`,
        secondary: `flex items-center justify-center gap-2 font-medium py-2 px-4 rounded transition duration-200 ${
            darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`,
        text: `flex items-center gap-2 font-medium ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'}`
    };

    const handlePasswordChange = () => {
        // Reset messages
        setPasswordError("");
        setPasswordSuccess("");

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError("Tous les champs sont obligatoires");
            return;
        }
        if (newPassword.length < 8) {
            setPasswordError("Le mot de passe doit contenir au moins 8 caractères");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError("Les nouveaux mots de passe ne correspondent pas");
            return;
        }

        // Simuler une requête API
        setTimeout(() => {
            setPasswordSuccess("Mot de passe changé avec succès");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            // Masquer la section après 3 secondes
            setTimeout(() => setShowPasswordSection(false), 3000);
        }, 1000);
    };

    return (
        <SettingSection icon={Lock} title="Security" darkMode={darkMode}>
            <div className="space-y-6">
                {/* Two-Factor Authentication */}
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <ToggleSwitch
                        label="Two-Factor Authentication"
                        isOn={twoFactor}
                        onToggle={() => setTwoFactor(!twoFactor)}
                        darkMode={darkMode}
                    />
                    <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Ajoutez une couche de sécurité supplémentaire à votre compte
                    </p>
                </div>

                {/* Password Change Section */}
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <button 
                        onClick={() => setShowPasswordSection(!showPasswordSection)}
                        className={`${buttonClasses.text} w-full justify-between`}
                    >
                        <span className="flex items-center gap-2">
                            <Lock size={16} />
                            Changer le mot de passe
                        </span>
                        {showPasswordSection ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {showPasswordSection && (
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className={textClasses.label}>Mot de passe actuel</label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className={textClasses.input}
                                        placeholder="Entrez votre mot de passe actuel"
                                    />
                                    <button 
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                                        ) : (
                                            <Eye size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className={textClasses.label}>Nouveau mot de passe</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className={textClasses.input}
                                        placeholder="Entrez votre nouveau mot de passe"
                                    />
                                    <button 
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                                        ) : (
                                            <Eye size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className={textClasses.label}>Confirmer le nouveau mot de passe</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={textClasses.input}
                                        placeholder="Confirmez votre nouveau mot de passe"
                                    />
                                    <button 
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                                        ) : (
                                            <Eye size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                                        )}
                                    </button>
                                </div>
                                {passwordError && <p className={textClasses.error}>{passwordError}</p>}
                                {passwordSuccess && <p className={textClasses.success}>{passwordSuccess}</p>}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={() => {
                                        setShowPasswordSection(false);
                                        setPasswordError("");
                                        setPasswordSuccess("");
                                    }}
                                    className={buttonClasses.secondary}
                                >
                                    Annuler
                                </button>
                                <button 
                                    onClick={handlePasswordChange}
                                    className={buttonClasses.primary}
                                >
                                    Changer le mot de passe
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Security Sessions */}
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        Sessions actives
                    </h3>
                    <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Vous êtes actuellement connecté sur 2 appareils
                    </p>
                    <button className={`${buttonClasses.text} mt-3 text-sm`}>
                        Voir toutes les sessions actives
                    </button>
                </div>
            </div>
        </SettingSection>
    );
};

export default Security;