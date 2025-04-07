import { User, Edit, Upload, Camera } from "lucide-react";
import { useState, useRef } from "react";
import SettingSection from "./SettingSection";
import { useTheme } from "@/context/ThemeContext";

const Profile = () => {
    const { darkMode } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("John Doe");
    const [email, setEmail] = useState("john.doe@example.com");
    const [profileImage, setProfileImage] = useState('/pic.webp');
    const fileInputRef = useRef(null);

    // Classes dynamiques
    const textClasses = {
        name: `text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`,
        email: darkMode ? 'text-gray-400' : 'text-gray-600',
        label: `block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`,
        input: `w-full p-2.5 rounded-lg border text-sm ${
            darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
        }`
    };

    const buttonClasses = {
        primary: `flex items-center justify-center gap-2 font-medium py-2 px-4 rounded transition duration-200 w-full sm:w-auto ${
            darkMode 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-indigo-500 hover:bg-indigo-600'
        } text-white`,
        secondary: `flex items-center justify-center gap-2 font-medium py-2 px-4 rounded transition duration-200 w-full sm:w-auto ${
            darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        // Ici vous pourriez ajouter une logique pour sauvegarder les modifications
        setIsEditing(false);
        console.log("Profile updated:", { name, email, profileImage });
    };

    return (
        <SettingSection icon={User} title="Profile" darkMode={darkMode}>
            <div className='flex flex-col sm:flex-row items-center mb-6 gap-4'>
                <div className="relative group">
                    <img
                        src={profileImage}
                        alt='Profile'
                        className='rounded-full w-20 h-20 object-cover border-2 border-indigo-400'
                    />
                    <button 
                        onClick={() => fileInputRef.current.click()}
                        className={`absolute bottom-0 right-0 p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                    >
                        <Camera size={16} className={darkMode ? 'text-white' : 'text-gray-800'} />
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>
                
                {isEditing ? (
                    <div className="w-full">
                        <div className="mb-4">
                            <label className={textClasses.label}>Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={textClasses.input}
                            />
                        </div>
                        <div className="mb-4">
                            <label className={textClasses.label}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={textClasses.input}
                            />
                        </div>
                    </div>
                ) : (
                    <div>
                        <h3 className={textClasses.name}>{name}</h3>
                        <p className={textClasses.email}>{email}</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                {isEditing ? (
                    <>
                        <button 
                            onClick={() => setIsEditing(false)}
                            className={buttonClasses.secondary}
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            className={buttonClasses.primary}
                        >
                            Save Changes
                        </button>
                    </>
                ) : (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className={buttonClasses.primary}
                    >
                        <Edit size={16} />
                        Edit Profile
                    </button>
                )}
            </div>
        </SettingSection>
    );
};

export default Profile;