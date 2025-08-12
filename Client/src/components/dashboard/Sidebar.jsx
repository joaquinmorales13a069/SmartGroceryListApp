import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    MdDashboard,
    MdAdd,
    MdList,
    MdSettings,
    MdLogout,
    MdRestaurant,
    MdInventory,
    MdPeople,
} from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (token) {
                    const response = await axios.get(
                        "http://localhost:5000/api/users/me",
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    setIsAdmin(response.data.user.userType === "admin");
                }
            } catch (error) {
                console.error("Error checking admin status:", error);
            } finally {
                setLoading(false);
            }
        };
        checkAdminStatus();
    }, []);

    const menuItems = [
        { name: "Dashboard", icon: MdDashboard, path: "/dashboard" },
        { name: "Add Grocery List", icon: MdAdd, path: "/create-new-list" },
        { name: "All Grocery Lists", icon: MdList, path: "/all-grocery-lists" },
        { name: "Profile & Settings", icon: MdSettings, path: "/settings" },
    ];

    // Admin-only menu items
    const adminMenuItems = [
        { name: "List All Items", icon: MdInventory, path: "/admin/items" },
        { name: "List All Users", icon: MdPeople, path: "/admin/users" },
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

    if (loading) {
        return (
            <div className="sidebar h-screen overflow-y-auto flex flex-col">
                <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="sidebar h-screen overflow-y-auto flex flex-col">
            {/* Logo Section */}
            <div className="hidden sm:block p-4 border-b border-gray-300">
                <div className="flex items-center gap-2">
                    <MdRestaurant className="text-2xl text-emerald-600" />
                    <h1 className="text-xl font-bold text-gray-800">
                        <span className="text-emerald-600">dAI</span>
                        <span className="text-gray-700">licious</span>
                    </h1>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-1">
                    Smart Grocery Planning
                </p>
            </div>

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

                {/* Admin-only menu items */}
                {isAdmin && (
                    <>
                        <div className="border-t border-gray-300 my-2"></div>
                        <div className="px-4 py-2">
                            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                                Admin Panel
                            </span>
                        </div>
                        {adminMenuItems.map((item) => {
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
                    </>
                )}
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
