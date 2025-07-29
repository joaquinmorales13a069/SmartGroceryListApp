import React from "react";
import Dashboard from "./Dashboard";
import CreateGroceryList from "./CreateGroceryList";
import UserGroceryLists from "./UserGroceryLists";

function MainContent({ activeScreen }) {
    return (
        <div className="main-content">
            {activeScreen === "Dashboard" && <Dashboard />}
            {activeScreen === "Create Grocery List" && <CreateGroceryList />}
            {activeScreen === "All Grocery Lists" && <UserGroceryLists />}
        </div>
    );
}

export default MainContent;
