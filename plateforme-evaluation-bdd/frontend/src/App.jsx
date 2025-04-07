import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
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

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to={currentUser.role === 'etudiant' ? "/dahboard-etudiant" : "/react-dashboard"} replace />;
  }

  return children;
}

function AppRoutes() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const hideSidebarRoutes = ["/", "/register"];
  const isLoginPage = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className={`min-h-screen ${isLoginPage ? 'flex justify-center items-center' : 'flex'}`}>
      {!isLoginPage && <Sidebar />}
      <div className="w-full overflow-y-auto">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dahboard-etudiant" element={<ProtectedRoute allowedRoles={['etudiant']}><Visualisation /></ProtectedRoute>} />
          <Route path="/viewRapport" element={<ProtectedRoute allowedRoles={['professeur']}><ViewRapportEtudiant /></ProtectedRoute>} />
          <Route path="/notes-etudiant" element={<ProtectedRoute allowedRoles={['etudiant']}><NotesEtudiant /></ProtectedRoute>} />
          <Route path="/react-dashboard" element={<ProtectedRoute allowedRoles={['professeur']}><Dashboard /></ProtectedRoute>} />
          <Route path="/ajoutExercice" element={<ProtectedRoute allowedRoles={['professeur']}><AjoutExercice /></ProtectedRoute>} />
          <Route path="/sujets-deposes" element={<ProtectedRoute allowedRoles={['etudiant']}><AccesSujetsDeposesProf /></ProtectedRoute>} />
          <Route path="/consultation-notes" element={<ProtectedRoute allowedRoles={['professeur']}><ConsultationNotes /></ProtectedRoute>} />
          <Route path="/correction-models" element={<ProtectedRoute allowedRoles={['professeur']}><CorrectionModelsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute allowedRoles={['professeur', 'etudiant']}><SettingsPage /></ProtectedRoute>} />
          <Route path="/connected-accounts" element={<ProtectedRoute allowedRoles={['professeur', 'etudiant']}><ConnectedAccounts /></ProtectedRoute>} />
          
          <Route path="*" element={
            currentUser ? (
              <Navigate to={currentUser.role === 'etudiant' ? "/dahboard-etudiant" : "/react-dashboard"} replace />
            ) : (
              <Navigate to="/" replace />
            )
          } />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;