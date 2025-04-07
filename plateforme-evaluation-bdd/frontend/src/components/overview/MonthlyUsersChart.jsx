import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const monthlyUsersData = [
	{ name: "Jan", users: 2200 },
	{ name: "Feb", users: 2900 },
	{ name: "Mar", users: 3800 },
	{ name: "Apr", users: 3600 },
	{ name: "May", users: 1600 },
	{ name: "Jun", users: 2000 },
	{ name: "Jul", users: 2200 },
	{ name: "Aug", users: 3400 },
	{ name: "Sep", users: 4400 },
	{ name: "Oct", users: 4600 },
	{ name: "Nov", users: 6200 },
	{ name: "Dec", users: 7900 },
];

const MonthlyUsersChart = () => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<h2 className='text-lg font-medium mb-4 text-gray-100'>Monthly Active Users</h2>

			<div className='h-80'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<LineChart data={monthlyUsersData}>
						<CartesianGrid strokeDasharray='8 1' stroke='#4B5563' />
						<XAxis dataKey={"name"} stroke='#9ca3af' />
						<YAxis stroke='#9ca3af' />
						<Tooltip
							contentStyle={{
								backgroundColor: "#050414",
								border: 'none',
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Line
							type='monotone'
							dataKey='users'
							stroke='#6aed64'
							strokeWidth={3}
							dot={{ fill: "#114f0e", strokeWidth: 1, r: 4 }}
							activeDot={{ r: 8, strokeWidth: 2 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default MonthlyUsersChart;