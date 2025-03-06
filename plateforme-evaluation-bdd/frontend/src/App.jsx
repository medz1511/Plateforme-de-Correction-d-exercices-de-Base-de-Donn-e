import { Route, Routes } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";

import Dashboard from "./pages/Dashboard";
import ProductsPage from "./pages/ProductsPage";
import Leads from "./pages/Leads";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage"; 

function App() {
	return (
		<div className='flex h-screen bg-black text-gray-100 overflow-hidden'>
			<Sidebar />
			<Routes>
				<Route path='/react-dashboard/' element={<Dashboard />} />
				<Route path='/react-dashboard/leads' element={<Leads />} />
				<Route path='/react-dashboard/analytics' element={<AnalyticsPage />} />
				<Route path='/react-dashboard/products' element={<ProductsPage />} />
				<Route path='/react-dashboard/reports' element={<SalesPage />} />
				<Route path='/react-dashboard/orders' element={<OrdersPage />} />
				<Route path='/react-dashboard/settings' element={<SettingsPage />} />
			</Routes>
		</div>
	);
}

export default App;