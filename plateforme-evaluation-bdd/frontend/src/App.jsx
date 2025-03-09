import { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
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

function App() {
    const location = useLocation();
    const hideSidebarRoutes = ["/", "/register"]; // Liste des routes sans sidebar
    const isLoginPage = hideSidebarRoutes.includes(location.pathname);

    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

    // Appliquer le bon thème au chargement de la page
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    return (
        <div className={`min-h-screen ${isLoginPage ? 'flex justify-center items-center' : 'flex bg-black text-gray-100'}`}>
            {/* Affiche le Sidebar sauf sur la page de connexion */}
            {!isLoginPage && <Sidebar />}
            <div className="w-full overflow-y-auto">
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/connected-accounts" element={<ConnectedAccounts />} />
                    <Route path="/react-dashboard" element={<Dashboard />} />
                    <Route path="/leads" element={<Leads />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/reports" element={<SalesPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/correction-models" element={<CorrectionModelsPage />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
