import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import Header from "../components/common/Header";
import ConnectedAccounts from "../components/settings/ConnectedAccounts";
import Notifications from "../components/settings/Notifications";
import Profile from "../components/settings/Profile";
import Security from "../components/settings/Security";

const SettingsPage = () => {
  const { darkMode } = useTheme();
  const [activeSection, setActiveSection] = useState("profile");

  const sections = [
    { id: "profile", component: <Profile darkMode={darkMode} />, label: "Profil" },
    { id: "notifications", component: <Notifications darkMode={darkMode} />, label: "Notifications" },
    { id: "security", component: <Security darkMode={darkMode} />, label: "Sécurité" },
    { id: "accounts", component: <ConnectedAccounts darkMode={darkMode} />, label: "Comptes connectés" },
  ];

  return (
    <div className={`flex-1 overflow-auto relative z-10 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <Header title='Paramètres' />
      
      <div className="max-w-4xl mx-auto py-6 px-4 lg:px-8">
        {/* Navigation horizontale pour les sections */}
        <div className={`mb-6 overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md transition-colors duration-300`}>
          <nav className="flex">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-3 font-medium text-sm transition-colors duration-200 ${
                  activeSection === section.id
                    ? darkMode
                      ? 'bg-indigo-600 text-white'
                      : 'bg-blue-600 text-white'
                    : darkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu de la section active */}
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'} transition-colors duration-300`}>
          {sections.find(section => section.id === activeSection)?.component}
        </div>

        {/* Boutons d'action globaux */}
        <div className={`mt-6 flex justify-end space-x-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md transition-colors duration-300`}>
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors duration-200`}
          >
            Annuler
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              darkMode
                ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            } transition-colors duration-200`}
          >
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;