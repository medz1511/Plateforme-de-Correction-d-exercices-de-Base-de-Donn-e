# Dashboard Interface

### This project is a modern dashboard interface built using React, Tailwind CSS, and other open-source tools. 
### The dashboard provides smooth interactions using framer-motion for animations, utilizes react-router-dom for routing, and displays data visualization through recharts.




## Features
- Responsive layout powered by Tailwind CSS.
- Interactive animations with Framer Motion.
- Routing handled with React Router DOM.
- Data visualization using Recharts.






# Installation
Follow these steps to set up the project on your local machine.

### Prerequisites
```bash
Node.js (version 14 or above)
```

## 1. Clone the repository
```bash
git clone https://github.com/binay-das/react-dashboard.git

cd react-dashboard
```

## 2. Install dependencies
```bash
npm install  
```
This will install all the required packages specified in the package.json file.

## 3. Run the project
```bash
npm run dev
```

This will start the Vite development server, and the app can be accessed at:
http://localhost:5173



# Project Structure
```bash

react-dashboard
│
├── public/               
├── src/                 
│   ├── components/
│   │   ├── analytics/
│   │   │   ├── AIPoweredInsights.jsx
│   │   │   ├── ChannelPerformance.jsx
│   │   │   ├── CustomerSegmentation.jsx
│   │   │   ├── OverviewCards.jsx
│   │   │   ├── ProductPerformance.jsx
│   │   │   ├── RevenueChart.jsx
│   │   │   └── UserRetention.jsx
│   │   │
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── StatCard.jsx
│   │   │
│   │   ├── orders/
│   │   │   ├── DailyOrders.jsx
│   │   │   └── OrderDistribution.jsx
│   │   │
│   │   ├── overview/
│   │   │   ├── CategoryDistribution.jsx
│   │   │   ├── MonthlyUsersChart.jsx
│   │   │   └── SalesChannelChart.jsx
│   │   │
│   │   ├── products/
│   │   │   ├── ProductsTable.jsx
│   │   │   └── SalesTrendChart.jsx
│   │   │
│   │   ├── sales/
│   │   │   ├── DailySalesTrend.jsx
│   │   │   └── SalesOverviewChart.jsx
│   │   │
│   │   ├── settings/
│   │   │   ├── ConnectedAccounts.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Security.jsx
│   │   │   ├── SettingSection.jsx
│   │   │   └── ToggleSwitch.jsx
│   │   │   
│   │   │
│   │   └── users/
│   │       ├── UserActivityHeatmap.jsx
│   │       ├── UserDemographicsChart.jsx
│   │       ├── UserGrowthChart.jsx
│   │       └── UsersTable.jsx
│   │
│   │
│   ├── pages/
│   │   ├── AnalyticsPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Leads.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── SalesPage.jsx
│   │   └── SettingsPage.jsx
│   │
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│    
├── .gitignore
├── eslint.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md   
├── tailwind.config.js    
└── vite.config.js        

```