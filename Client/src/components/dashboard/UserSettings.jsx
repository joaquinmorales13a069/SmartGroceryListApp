import React, { useState, useEffect } from "react";
import UserProfileForm from "../UserProfileForm";
import UserPreferencesForm from "../UserPreferencesForm";
import UserPasswordForm from "../UserPasswordForm";
import DeleteAccountSection from "../DeleteAccountSection";
import AdminUserManagement from "../AdminUserManagement";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

const TABS = [
    { key: "profile", label: "Profile" },
    { key: "preferences", label: "Preferences" },
    { key: "security", label: "Security" },
    { key: "delete", label: "Delete Account" },
];

export default function UserSettings() {
    const [activeTab, setActiveTab] = useState("profile");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const res = await axios.get(
                    "http://localhost:5000/api/users/me",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setUser(res.data.user);
                setIsAdmin(res.data.user.userType === "admin");
            } catch (err) {
                toast.error(
                    "Failed to load user data: " + err.response.data.message
                );
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleTabChange = (key) => setActiveTab(key);

    // Handlers for updating user info, password, etc. will be passed to children
    // ...

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!user)
        return (
            <div className="text-center py-10 text-[#FF6F61]">
                User not found.
            </div>
        );

    const allTabs = isAdmin
        ? [...TABS, { key: "admin", label: "Admin" }]
        : TABS;

    return (
        <div className="container">
            <Sidebar />
            <div className="main-content">
                <div className="min-h-screen bg-[#F9F5EF] flex flex-col items-center p-6">
                    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-[#333333] mb-6 text-center">
                            User Settings
                        </h2>
                        <div className="flex gap-2 mb-6 justify-center">
                            {allTabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-[#333333] ${
                                        activeTab === tab.key
                                            ? "bg-[#76C893] text-white"
                                            : "bg-[#F9F5EF] hover:bg-[#FFB74D]"
                                    }`}
                                    onClick={() => handleTabChange(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        <div>
                            {activeTab === "profile" && (
                                <UserProfileForm
                                    user={user}
                                    setUser={setUser}
                                />
                            )}
                            {activeTab === "preferences" && (
                                <UserPreferencesForm
                                    user={user}
                                    setUser={setUser}
                                />
                            )}
                            {activeTab === "security" && (
                                <UserPasswordForm
                                    user={user}
                                    setUser={setUser}
                                />
                            )}
                            {activeTab === "delete" && (
                                <DeleteAccountSection user={user} />
                            )}
                            {activeTab === "admin" && isAdmin && (
                                <AdminUserManagement />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
