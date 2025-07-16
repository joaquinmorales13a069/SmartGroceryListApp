import React from "react";

function Sidebar({ activeScreen, setActiveScreen }) {
    const menuItems = [
        "Dashboard",
        "AI Meal Planner",
        "Grocery List",
        "Spending & Consumption Overview",
        "Calendar / Meal Schedule",
        "Purchase History",
        "Recipe Discovery",
        "Deals & Promotions",
        "Family/Household Management",
        "Profile & Settings",
    ];

    return (
        <div className="sidebar">
            {menuItems.map((item) => (
                <a
                    key={item}
                    href="#"
                    className={
                        activeScreen === item ? "menu-item active" : "menu-item"
                    }
                    onClick={() => setActiveScreen(item)}
                >
                    {item}
                </a>
            ))}
        </div>
    );
}

export default Sidebar;
