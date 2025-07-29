import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/dashboard/Sidebar";
import Dashboard from "../components/dashboard/Dashboard";

function UserDashboard() {
    return (
        <div>
            {/* <Header /> */}
            <div className="container">
                <Sidebar />
                <div className="main-content">
                    <Dashboard />
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
