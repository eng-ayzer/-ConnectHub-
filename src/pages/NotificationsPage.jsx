import React from "react";
import Sidebar from "../components/layout/Sidebar.jsx";
import Footer from "../components/layout/Footer.jsx";

function NotificationsPage() {
  
  return (
    <div className="flex flex-col lg:flex-row w-full">
      <Sidebar />
      <main className="w-full px-4 py-8 max-w-4xl mx-auto lg:ml-48">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Notifications</h1>
          </div>
          
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Notifications Coming Soon</h3>
            <p className="text-gray-600 mb-4">This feature is under development.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


export default NotificationsPage;
