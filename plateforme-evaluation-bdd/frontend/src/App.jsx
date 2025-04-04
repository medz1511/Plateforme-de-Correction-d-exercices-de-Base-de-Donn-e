import { useState, useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import Dashboard from "./pages/Dashboard";
import ProductsPage from "./pages/ProductsPage";
import Leads from "./pages/Leads";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
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
              <ProtectedRoute allowedRoles={['etudiant']}>
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
              <ProtectedRoute allowedRoles={['professeur']}>
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
          
          {/* Autres routes (réservées aux professeurs pour l'instant) */}
          <Route 
            path="/leads" 
            element={
              <ProtectedRoute allowedRoles={['professeur']}>
                <Leads />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute allowedRoles={['professeur']}>
                <AnalyticsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/products" 
            element={
              <ProtectedRoute allowedRoles={['professeur']}>
                <ProductsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute allowedRoles={['professeur']}>
                <SalesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute allowedRoles={['professeur']}>
                <OrdersPage />
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