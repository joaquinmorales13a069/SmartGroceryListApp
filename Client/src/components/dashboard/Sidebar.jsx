import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    MdDashboard,
    MdAdd,
    MdList,
    MdSettings,
    MdLogout,
} from "react-icons/md";
import { toast } from "react-toastify";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: "Dashboard", icon: MdDashboard, path: "/dashboard" },
        { name: "Add Grocery List", icon: MdAdd, path: "/create-new-list" },
        { name: "All Grocery Lists", icon: MdList, path: "/all-grocery-lists" },
        { name: "Profile & Settings", icon: MdSettings, path: "/settings" },
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

    const isActiveRoute = (path) => {
        if (path === "/dashboard") {
            return location.pathname === "/dashboard";
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="sidebar h-screen overflow-y-auto flex flex-col">
            <div className="flex-1">
                {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                        <button
                            key={item.name}
                            className={
                                isActiveRoute(item.path)
                                    ? "menu-item active"
                                    : "menu-item"
                            }
                            onClick={() => navigate(item.path)}
                        >
                            <div className="flex items-center gap-3 w-full">
                                <IconComponent className="text-lg flex-shrink-0" />
                                <span className="hidden sm:block text-left">
                                    {item.name}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Logout Button */}
            <div className="mt-auto border-t border-gray-300 pt-4">
                <button
                    onClick={handleLogout}
                    className="menu-item hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
                >
                    <div className="flex items-center gap-3 w-full">
                        <MdLogout className="text-lg flex-shrink-0" />
                        <span className="hidden sm:block text-left">
                            Logout
                        </span>
                    </div>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
