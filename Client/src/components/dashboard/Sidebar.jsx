import React from "react";

function Sidebar({ activeScreen, setActiveScreen }) {
    const menuItems = [
        "Dashboard",
        "Create Grocery List",
        "All Grocery Lists",
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
