import { useTheme } from "../context/ThemeContext";
import Header from "../components/common/Header";
import ConnectedAccounts from "../components/settings/ConnectedAccounts";
import Notifications from "../components/settings/Notifications";
import Profile from "../components/settings/Profile";
import Security from "../components/settings/Security";

const SettingsPage = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`flex-1 overflow-auto relative z-10 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <Header title='Paramètres' />
      
      <main className='max-w-4xl mx-auto py-6 px-4 lg:px-8 space-y-6'>
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'} transition-colors duration-300`}>
          <Profile darkMode={darkMode} />
        </div>
        
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'} transition-colors duration-300`}>
          <Notifications darkMode={darkMode} />
        </div>
        
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'} transition-colors duration-300`}>
          <Security darkMode={darkMode} />
        </div>
        
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'} transition-colors duration-300`}>
          <ConnectedAccounts darkMode={darkMode} />
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;