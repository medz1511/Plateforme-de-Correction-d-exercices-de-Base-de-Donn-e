import { 
    BarChart2, Menu, Settings, FileText as FileTextIcon,
    FileText, ClipboardList, ClipboardCheck, FilePlus, Clipboard, LogOut 
  } from "lucide-react";
  import { useState } from "react";
  import { AnimatePresence, motion } from "framer-motion";
  import { Link, useLocation } from "react-router-dom";
  import { useAuth } from "../../context/AuthContext";
  import { useTheme } from "../../context/ThemeContext";
  
  const SIDEBAR_ITEMS = [
    { name: "Dashboard ", icon: BarChart2, color: "#6366f1", href: "/react-dashboard", roles: ["professeur"] },
    { name: "Nouveau Exercices", icon: FilePlus, color: "#F59E0B", href: "/ajoutExercice", roles: ["professeur"] },
    { name: "Modèles de correction", icon: FileTextIcon, color: "#0D9488", href: "/correction-models", roles: ["professeur"] },
    { name: "Consultation notes", icon: Clipboard, color: "#8B5CF6", href: "/consultation-notes", roles: ["professeur"] },
    { name: "rapports Etudiants", icon: FileText, color: "#EC4899", href: "/viewRapport", roles: ["professeur"] },
    { name: "Dashboard ", icon: BarChart2, color: "#6366f1", href: "/dahboard-etudiant", roles: ["etudiant"] },
    { name: "Mes notes", icon: ClipboardCheck, color: "#10B981", href: "/notes-etudiant", roles: ["etudiant"] },
    { name: "Travail à faire", icon: ClipboardList, color: "#F59E0B", href: "/sujets-deposes", roles: ["etudiant"] },
    { name: "Settings", icon: Settings, color: "#6B7280", href: "/settings", roles: ["professeur", "etudiant"] },
  ];
  
  const Sidebar = () => {
      const [isSidebarOpen, setIsSidebarOpen] = useState(true);
      const { currentUser, logout } = useAuth();
      const { darkMode } = useTheme();
      const location = useLocation();
  
      const filteredItems = SIDEBAR_ITEMS.filter(item => 
          item.roles.includes(currentUser?.role || "etudiant")
      );
  
      const handleLogout = async () => {
          await logout();
          window.location.href = "/";
      };
  
      return (
          <motion.div
              className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0`}
              animate={{ width: isSidebarOpen ? 256 : 80 }}
          >
              <div className={`h-full ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} p-4 flex flex-col border-r`}>
                  <div className="flex items-center justify-between mb-6">
                      {isSidebarOpen && (
                          <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                          >
                              Lafinal
                          </motion.div>
                      )}
                      <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                          className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                      >
                          <Menu size={24} className={darkMode ? 'text-white' : 'text-gray-900'} />
                      </motion.button>
                  </div>
  
                  {isSidebarOpen && (
                      <div className={`mb-6 p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg`}>
                          <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-indigo-600' : 'bg-indigo-500'} flex items-center justify-center text-white font-bold`}>
                                  {currentUser?.name?.[0].toUpperCase() || 'U'}
                              </div>
                              <div>
                                  <p className={darkMode ? 'text-white' : 'text-gray-900'}>{currentUser?.name || 'Utilisateur'}</p>
                                  <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{currentUser?.role || 'Non défini'}</p>
                              </div>
                          </div>
                      </div>
                  )}
  
                  <nav className='flex-grow'>
                      {filteredItems.map((item) => {
                          const isActive = location.pathname === item.href;
                          return (
                              <Link key={item.href} to={item.href}>
                                  <motion.div 
                                      className={`flex items-center p-4 text-sm font-medium rounded-lg mb-2 ${
                                          isActive 
                                              ? (darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900')
                                              : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')
                                      }`}
                                  >
                                      <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                                      <AnimatePresence>
                                          {isSidebarOpen && (
                                              <motion.span
                                                  className='ml-4 whitespace-nowrap'
                                                  initial={{ opacity: 0, width: 0 }}
                                                  animate={{ opacity: 1, width: "auto" }}
                                                  exit={{ opacity: 0, width: 0 }}
                                                  transition={{ duration: 0.2, delay: 0.1 }}
                                              >
                                                  {item.name}
                                              </motion.span>
                                          )}
                                      </AnimatePresence>
                                  </motion.div>
                              </Link>
                          );
                      })}
                  </nav>
  
                  <motion.button
                      onClick={handleLogout}
                      className={`flex items-center p-4 text-sm font-medium rounded-lg mt-4 ${
                          darkMode ? 'hover:bg-red-900' : 'hover:bg-red-100'
                      }`}
                  >
                      <LogOut size={20} className="text-red-500" />
                      <AnimatePresence>
                          {isSidebarOpen && (
                              <motion.span
                                  className='ml-4 whitespace-nowrap'
                                  initial={{ opacity: 0, width: 0 }}
                                  animate={{ opacity: 1, width: "auto" }}
                                  exit={{ opacity: 0, width: 0 }}
                                  transition={{ duration: 0.2, delay: 0.1 }}
                              >
                                  Déconnexion
                              </motion.span>
                          )}
                      </AnimatePresence>
                  </motion.button>
              </div>
          </motion.div>
      );
  };
  
  export default Sidebar;