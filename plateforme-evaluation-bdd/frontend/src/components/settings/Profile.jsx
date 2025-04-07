import { User } from "lucide-react";
import SettingSection from "./SettingSection";
import { useTheme } from "@/context/ThemeContext";

const Profile = () => {
    const { darkMode } = useTheme();

    // Classes dynamiques
    const nameClasses = `text-lg font-semibold ${
        darkMode ? 'text-gray-100' : 'text-gray-800'
    }`;
    const emailClasses = darkMode ? 'text-gray-400' : 'text-gray-600';
    const buttonClasses = `font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto ${
        darkMode 
            ? 'bg-indigo-600 hover:bg-indigo-700' 
            : 'bg-indigo-500 hover:bg-indigo-600'
    } text-white`;

    return (
        <SettingSection icon={User} title="Profile" darkMode={darkMode}>
            <div className='flex flex-col sm:flex-row items-center mb-6'>
                <img
                    src='/pic.webp'
                    alt='Profile'
                    className='rounded-full w-20 h-20 object-cover mr-4 border-2 border-indigo-400'
                />
                <div>
                    <h3 className={nameClasses}>John Doe</h3>
                    <p className={emailClasses}>john.doe@example.com</p>
                </div>
            </div>

            <button className={buttonClasses}>
                Edit Profile
            </button>
        </SettingSection>
    );
};

export default Profile;