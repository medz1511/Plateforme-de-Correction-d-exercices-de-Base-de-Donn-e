import { useState, useEffect } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import { BsSun, BsMoon } from "react-icons/bs";

const Header = ({ title }) => {
	// État pour le mode sombre
	const [darkMode, setDarkMode] = useState(
		localStorage.getItem("theme") === "dark"
	);

	// Fonction pour basculer entre les thèmes
	const toggleDarkMode = () => {
		const newTheme = darkMode ? "light" : "dark";
		setDarkMode(!darkMode);
		document.documentElement.classList.toggle("dark", !darkMode);
		localStorage.setItem("theme", newTheme);
	};

	// Appliquer le bon thème au chargement de la page
	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [darkMode]);

	return (
		<header className='bg-[#1E2A47] bg-opacity-90 backdrop-blur-md shadow-lg border-b border-gray-700'>
			<div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between'>
				{/* Titre */}
				<h1 className='text-2xl font-semibold text-gray-200'>{title}</h1>

				{/* Actions (Mode sombre, Notifications & Déconnexion) */}
				<div className='flex items-center gap-6'>
					{/* Mode sombre / clair */}
					<button
						onClick={toggleDarkMode}
						className='p-2 rounded-md text-gray-300 hover:text-white transition'
					>
						{darkMode ? <BsSun className='text-xl' /> : <BsMoon className='text-xl' />}
					</button>

					{/* Notification Icon */}
					<div className='relative cursor-pointer'>
						<IoMdNotificationsOutline className='text-2xl text-gray-300 hover:text-white transition' />
						<span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full'>
							3
						</span>
					</div>

					{/* Sign Out Button */}
					<button
						className='flex items-center gap-2 bg-blue-600 px-3 py-1.5 rounded-md text-white text-sm hover:bg-blue-700 transition'
						onClick={() => console.log("User signed out")}
					>
						<FiLogOut className='text-lg' />
						<span>Sign Out</span>
					</button>
				</div>
			</div>
		</header>
	);
};

export default Header;
