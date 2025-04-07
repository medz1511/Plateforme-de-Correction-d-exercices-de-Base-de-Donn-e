import { IoMdNotificationsOutline } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import { BsSun, BsMoon } from "react-icons/bs";
import { useTheme } from "../../context/ThemeContext"; // Chemin corrigé

const Header = ({ title }) => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <header className={`${darkMode ? 'bg-[#1E2A47] border-gray-700' : 'bg-white border-gray-200'} bg-opacity-90 backdrop-blur-md shadow-lg border-b transition-colors duration-300`}>
      <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between'>
        <h1 className={`text-2xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {title}
        </h1>

        <div className='flex items-center gap-6'>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-md ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} transition`}
            aria-label={darkMode ? "Passer en mode clair" : "Passer en mode sombre"}
          >
            {darkMode ? <BsSun className='text-xl' /> : <BsMoon className='text-xl' />}
          </button>

          <div className='relative cursor-pointer'>
            <IoMdNotificationsOutline className={`text-2xl ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} transition`} />
            <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full'>
              3
            </span>
          </div>

          <button
            className={`flex items-center gap-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} px-3 py-1.5 rounded-md text-white text-sm transition`}
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