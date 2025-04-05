import { 
    BarChart2, DollarSign, Menu, Settings, ShoppingBag, 
    ShoppingCart, TrendingUp, Users, FileText as FileTextIcon
  } from "lucide-react";
  import { useState } from "react";
  import { AnimatePresence, motion } from "framer-motion";
  import { Link, useLocation } from "react-router-dom";
  import { FileText, ClipboardList, ClipboardCheck, FilePlus, Clipboard, LogOut } from "lucide-react";
  import { useAuth } from "../../context/AuthContext";
  
  // Définir les items du sidebar avec leur rôle associé
  const SIDEBAR_ITEMS = [
      // Items pour les professeurs
      { name: "Dashboard ", icon: BarChart2, color: "#6366f1", href: "/react-dashboard", roles: ["professeur"] },
      { name: "Nouveau Exercices", icon: FilePlus, color: "#F59E0B", href: "/ajoutExercice", roles: ["professeur"] },
      { name: "Modèles de correction", icon: FileTextIcon, color: "#6366f1", href: "/correction-models", roles: ["professeur"] },
      { name: "Consultation notes", icon: Clipboard, color: "#F59E0B", href: "/consultation-notes", roles: ["professeur"] },
      { name: "rapports Etudiants", icon: FileText, color: "#F59E0B", href: "/viewRapport", roles: ["professeur"] },
     
      // Items pour les étudiants
      { name: "Dashboard ", icon: BarChart2, color: "#6366f1", href: "/dahboard-etudiant", roles: ["etudiant"] },
      { name: "Mes notes", icon: ClipboardCheck, color: "#10B981", href: "/notes-etudiant", roles: ["etudiant"] },
      { name: "Mes Devoirs", icon: ClipboardList, color: "#F59E0B", href: "/devoirs", roles: ["etudiant"] },
      
      // Items pour tous les rôles
      { name: "Settings", icon: Settings, color: "#6EE7B7", href: "/settings", roles: ["professeur", "etudiant"] },
  ];
  
  const Sidebar = () => {
      const [isSidebarOpen, setIsSidebarOpen] = useState(true);
      const { currentUser, logout } = useAuth();
      const location = useLocation();
  
      // Filtrer les items du sidebar selon le rôle de l'utilisateur
      const filteredItems = SIDEBAR_ITEMS.filter(item => 
          item.roles.includes(currentUser?.role || "etudiant")
      );
  
      const handleLogout = async () => {
          await logout();
          window.location.href = "/"; // Redirection vers la page de connexion
      };
  
      return (
          <motion.div
              className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0`}
              animate={{ width: isSidebarOpen ? 256 : 80 }}
          >
              <div className='h-full bg-black bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700'>
                  <div className="flex items-center justify-between mb-6">
                      {isSidebarOpen && (
                          <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="text-xl font-bold text-white"
                          >
                              Lafinal
                          </motion.div>
                      )}
                      <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                          className='p-2 rounded-full hover:bg-gray-700 transition-colors'
                      >
                          <Menu size={24} />
                      </motion.button>
                  </div>
  
                  {/* Afficher le profil utilisateur */}
                  {isSidebarOpen && (
                      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                  {currentUser?.name?.[0].toUpperCase() || 'U'}
                              </div>
                              <div>
                                  <p className="text-white font-medium">{currentUser?.name || 'Utilisateur'}</p>
                                  <p className="text-gray-400 text-sm capitalize">{currentUser?.role || 'Non défini'}</p>
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
                                      className={`flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2 ${
                                          isActive ? 'bg-gray-700 text-white' : 'text-gray-300'
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
  
                  {/* Bouton de déconnexion */}
                  <div className="mt-4">
                      <motion.button
                          onClick={handleLogout}
                          className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-red-600 transition-colors w-full'
                      >
                          <LogOut size={20} style={{ color: "#F87171", minWidth: "20px" }} />
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
              </div>
          </motion.div>
      );
  };
  
  export default Sidebar;