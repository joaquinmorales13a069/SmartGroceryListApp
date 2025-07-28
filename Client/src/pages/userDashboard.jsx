import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/dashboard/Sidebar";
import MainContent from "../components/dashboard/MainContent";

function UserDashboard() {
    const [activeScreen, setActiveScreen] = useState("Dashboard");

    return (
        <div>
            {/* <Header /> */}
            <div className="container">
                <Sidebar
                    activeScreen={activeScreen}
                    setActiveScreen={setActiveScreen}
                />
                <MainContent activeScreen={activeScreen} />
            </div>
        </div>
    );
}

export default UserDashboard;
