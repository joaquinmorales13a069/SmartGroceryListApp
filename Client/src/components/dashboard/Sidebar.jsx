import React from "react";
import { useNavigate } from "react-router-dom";
import {
    MdDashboard,
    MdAdd,
    MdList,
    MdSettings,
    MdLogout,
} from "react-icons/md";
import { toast } from "react-toastify";

function Sidebar({ activeScreen, setActiveScreen }) {
    const navigate = useNavigate();

    const menuItems = [
        { name: "Dashboard", icon: MdDashboard },
        { name: "Add Grocery List", icon: MdAdd },
        { name: "All Grocery Lists", icon: MdList },
        { name: "Profile & Settings", icon: MdSettings },
    ];

    const handleLogout = () => {
        try {
            // Clear authentication data from localStorage
            localStorage.removeItem("authToken");
            localStorage.removeItem("userData");

            // Show success message
            toast.success("Logged out successfully!");

            // Redirect to login page after a short delay
            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (error) {
            console.error("Error during logout:", error);
            toast.error("Error logging out. Please try again.");
        }
    };

    return (
        <div className="sidebar h-screen overflow-y-auto flex flex-col">
            <div className="flex-1">
                {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                        <a
                            key={item.name}
                            href="#"
                            className={
                                activeScreen === item.name
                                    ? "menu-item active"
                                    : "menu-item"
                            }
                            onClick={() => setActiveScreen(item.name)}
                        >
                            <div className="flex items-center gap-3">
                                <IconComponent className="text-lg flex-shrink-0" />
                                <span className="hidden sm:block">
                                    {item.name}
                                </span>
                            </div>
                        </a>
                    );
                })}
            </div>

            {/* Logout Button */}
            <div className="mt-auto border-t border-gray-300 pt-4">
                <button
                    onClick={handleLogout}
                    className="menu-item w-full text-left hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
                >
                    <div className="flex items-center gap-3">
                        <MdLogout className="text-lg flex-shrink-0" />
                        <span className="hidden sm:block">Logout</span>
                    </div>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
