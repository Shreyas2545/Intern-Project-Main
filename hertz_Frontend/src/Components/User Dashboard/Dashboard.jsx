import React, { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Profile from "./Profile";
import SavedDesigns from "./SavedDesigns";
import OrderHistory from "./OrderHistory";
import TrackOrders from "./TrackOrders";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const renderTab = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "designs":
        return <SavedDesigns />;
      case "orders":
        return <OrderHistory />;
      case "track":
        return <TrackOrders />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="flex flex-col lg:flex-row w-full min-h-screen">
        <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
        <motion.main
          className="flex-1 p-4 sm:p-6 lg:p-8 bg-white/90 backdrop-blur-md rounded-r-2xl shadow-xl border border-gray-200/50 hover:shadow-2xl hover:ring-1 hover:ring-blue-500/20 transition-all duration-300 min-h-screen"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
          exit={{ opacity: 0, x: 20 }}
        >
          {renderTab()}
        </motion.main>
      </div>
    </div>
  );
};

export default Dashboard;
