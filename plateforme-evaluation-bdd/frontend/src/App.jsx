import { useState, useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import Dashboard from "./pages/Dashboard";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import ConnectedAccounts from "./components/settings/ConnectedAccounts";
import CorrectionModelsPage from "./pages/CorrectionModelsPage";
import AccesSujetsDeposesProf from "./pages/AccesSujetsDeposesProf";
import NotesEtudiant from "./pages/NotesEtudiant";
import ConsultationNotes from "./pages/ConsultationNotes";
import ViewRapportEtudiant from "./pages/ViewRapportEtudiant";
import AjoutExercice from "./pages/AjoutExercice";
import Visualisation from "./pages/Dashboard-Etudiant";
import { AuthProvider, useAuth } from "./context/AuthContext";
import OAuthCallback from "./pages/OAuthCallback";
// Composant pour les routes protégées
function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    if (currentUser.role === 'etudiant') {
      return <Navigate to="/dahboard-etudiant" replace />;
    } else {
      return <Navigate to="/react-dashboard" replace />;
    }
  }

  return children;
}

function AppRoutes() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const hideSidebarRoutes = ["/", "/register"];
  const isLoginPage = hideSidebarRoutes.includes(location.pathname);

  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${isLoginPage ? 'flex justify-center items-center' : 'flex bg-black text-gray-100'}`}>
      {!isLoginPage && <Sidebar />}
      <div className="w-full overflow-y-auto">
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />
          {/* Routes pour les étudiants */}
          <Route 
            path="/dahboard-etudiant" 
            element={
              <ProtectedRoute allowedRoles={['etudiant']}>
                <Visualisation />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/viewRapport" 
            element={
              <ProtectedRoute allowedRoles={['professeur']}>
                <ViewRapportEtudiant />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notes-etudiant" 
            element={
              <ProtectedRoute allowedRoles={['etudiant']}>
                <NotesEtudiant />
              </ProtectedRoute>
            } 
          />
          
          {/* Routes pour les professeurs */}
          <Route 
            path="/react-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['professeur']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ajoutExercice" 
            element={
              <ProtectedRoute allowedRoles={['professeur']}>
                <AjoutExercice />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sujets-deposes" 
            element={
              <ProtectedRoute allowedRoles={['etudiant']}>
                <AccesSujetsDeposesProf />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/consultation-notes" 
            element={
              <ProtectedRoute allowedRoles={['professeur']}>
                <ConsultationNotes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/correction-models" 
            element={
              <ProtectedRoute allowedRoles={['professeur']}>
                <CorrectionModelsPage />
              </ProtectedRoute>
            } 
          />
          
        
        
          
          {/* Routes accessibles aux deux rôles */}
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute allowedRoles={['professeur', 'etudiant']}>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/connected-accounts" 
            element={
              <ProtectedRoute allowedRoles={['professeur', 'etudiant']}>
                <ConnectedAccounts />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirection par défaut */}
          <Route 
            path="*" 
            element={
              currentUser ? (
                currentUser.role === 'etudiant' ? 
                  <Navigate to="/dahboard-etudiant" replace /> : 
                  <Navigate to="/react-dashboard" replace />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;