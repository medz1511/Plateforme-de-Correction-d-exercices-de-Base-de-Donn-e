import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import SettingSection from "./SettingSection";
import { HelpCircle, Plus } from "lucide-react";

const ConnectedAccounts = () => {
    const { darkMode } = useTheme();
    const [connectedAccounts, setConnectedAccounts] = useState([
        {
            id: 1,
            name: "Google",
            connected: true,
            icon: "/google.png",
        },
        {
            id: 2,
            name: "Facebook",
            connected: false,
            icon: "/facebook.svg",
        },
        {
            id: 3,
            name: "Twitter",
            connected: true,
            icon: "/x.png",
        },
    ]);

    const toggleConnection = (accountId) => {
        setConnectedAccounts(prevAccounts => 
            prevAccounts.map(account => 
                account.id === accountId 
                    ? { ...account, connected: !account.connected } 
                    : account
            )
        );
    };

    // Classes dynamiques
    const textColor = darkMode ? 'text-gray-300' : 'text-gray-700';
    const buttonConnectedClasses = darkMode 
        ? 'bg-green-600 hover:bg-green-700' 
        : 'bg-green-500 hover:bg-green-600';
    const buttonDisconnectedClasses = darkMode 
        ? 'bg-gray-600 hover:bg-gray-700' 
        : 'bg-gray-200 hover:bg-gray-300';
    const addButtonColor = darkMode 
        ? 'text-indigo-400 hover:text-indigo-300' 
        : 'text-indigo-600 hover:text-indigo-500';

    return (
        <SettingSection icon={HelpCircle} title={"Connected Accounts"}>
            {connectedAccounts.map((account) => (
                <div key={account.id} className='flex items-center justify-between py-3'>
                    <div className='flex items-center gap-2'>
                        <img 
                            src={account.icon} 
                            alt={`${account.name} icon`} 
                            className='size-6 object-cover rounded-full'
                        />
                        <span className={textColor}>{account.name}</span>
                    </div>
                    <button
                        className={`px-3 py-1 rounded text-white text-sm font-medium transition duration-200 ${
                            account.connected 
                                ? buttonConnectedClasses 
                                : buttonDisconnectedClasses
                        }`}
                        onClick={() => toggleConnection(account.id)}
                    >
                        {account.connected ? "Connected" : "Connect"}
                    </button>
                </div>
            ))}
            <button className={`mt-4 flex items-center transition duration-200 ${addButtonColor}`}>
                <Plus size={18} className='mr-2' /> 
                Add Account
            </button>
        </SettingSection>
    );
};

export default ConnectedAccounts;