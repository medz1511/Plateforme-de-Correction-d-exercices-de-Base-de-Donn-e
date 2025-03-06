import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/MonthlyUsersChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";

const Dashboard = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Dashboard' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Sales' icon={Zap} value='&#8377; 1,12,345' color='#6366F1' />
					<StatCard name='New Users' icon={Users} value='192' color='#8B5CF6' />
					<StatCard name='Total Courses' icon={ShoppingBag} value='12' color='#EC4899' />
					<StatCard name='Users Active Now' icon={BarChart2} value='52.5%' color='#10B981' />
				</motion.div>


				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					<SalesOverviewChart />
					<CategoryDistributionChart />
					<SalesChannelChart />
				</div>
			</main>
		</div>
	);
};
export default Dashboard;