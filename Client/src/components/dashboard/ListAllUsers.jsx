import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdEdit, MdDelete, MdSearch, MdPerson } from "react-icons/md";
import Sidebar from "./Sidebar";
import UserProfileForm from "../UserProfileForm";
import UserPreferencesForm from "../UserPreferencesForm";
import UserPasswordForm from "../UserPasswordForm";

export default function ListAllUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [editMode, setEditMode] = useState("profile"); // profile, preferences, security

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            const response = await axios.get(
                "http://localhost:5000/api/users",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setUsers(response.data.users);
        } catch (error) {
            toast.error("Failed to fetch users");
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this user? This action cannot be undone."
            )
        ) {
            return;
        }

        try {
            const token = localStorage.getItem("authToken");
            await axios.delete(`http://localhost:5000/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("User deleted successfully!");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to delete user");
            console.error("Error deleting user:", error);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setEditMode("profile");
    };

    const handleUserUpdate = async (updatedUser) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.patch(
                `http://localhost:5000/api/users/${editingUser._id}`,
                updatedUser,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success("User updated successfully!");
            setEditingUser(null);
            setEditMode("profile");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to update user");
            console.error("Error updating user:", error);
        }
    };

    const handlePasswordUpdate = async (passwordData) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.patch(
                `http://localhost:5000/api/users/${editingUser._id}`,
                passwordData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success("Password updated successfully!");
            setEditingUser(null);
            setEditMode("profile");
        } catch (error) {
            toast.error("Failed to update password");
            console.error("Error updating password:", error);
        }
    };

    const handleUserTypeUpdate = async (userType) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.patch(
                `http://localhost:5000/api/users/${editingUser._id}`,
                { userType },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success(`User role updated to ${userType} successfully!`);
            setEditingUser(null);
            setEditMode("profile");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to update user role");
            console.error("Error updating user role:", error);
        }
    };

    const getStatusBadge = (user) => {
        if (user.deleted) {
            return (
                <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                    Disabled
                </span>
            );
        }
        return (
            <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                Active
            </span>
        );
    };

    const getUserTypeBadge = (user) => {
        if (user.userType === "admin") {
            return (
                <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
                    Admin
                </span>
            );
        }
        return (
            <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                User
            </span>
        );
    };

    const filteredUsers = users.filter(
        (user) =>
            user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <Sidebar />
            <div className="main-content">
                <div className="min-h-screen bg-[#F9F5EF] p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-[#333333]">
                                    All Users
                                </h2>
                            </div>

                            {/* Search Bar */}
                            <div className="mb-6">
                                <div className="relative">
                                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                                    <input
                                        type="text"
                                        placeholder="Search users by name or email..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="w-full pl-10 pr-4 py-2 border border-[#76C893] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#76C893] focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-500">
                                        Loading users...
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Users Table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left py-3 px-4 font-semibold text-[#333333]">
                                                        User
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-[#333333]">
                                                        Email
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-[#333333]">
                                                        Dietary Preference
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-[#333333]">
                                                        Status
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-[#333333]">
                                                        User Type
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-[#333333]">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredUsers.map((user) => (
                                                    <tr
                                                        key={user._id}
                                                        className="border-b border-gray-100 hover:bg-gray-50"
                                                    >
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-[#76C893] rounded-full flex items-center justify-center">
                                                                    <MdPerson className="text-white text-lg" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-[#333333]">
                                                                        {
                                                                            user.firstName
                                                                        }{" "}
                                                                        {
                                                                            user.lastName
                                                                        }
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        Age:{" "}
                                                                        {user.age ||
                                                                            "N/A"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span className="text-[#333333]">
                                                                {user.email}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span className="text-sm text-gray-600">
                                                                {user.dietaryPreference ||
                                                                    "N/A"}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            {getStatusBadge(
                                                                user
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            {getUserTypeBadge(
                                                                user
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            user
                                                                        )
                                                                    }
                                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                                                                    title="Edit"
                                                                >
                                                                    <MdEdit className="text-lg" />
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            user._id
                                                                        )
                                                                    }
                                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                                                                    title="Delete"
                                                                    disabled={
                                                                        user.deleted
                                                                    }
                                                                >
                                                                    <MdDelete className="text-lg" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {filteredUsers.length === 0 && (
                                        <div className="text-center py-12 text-gray-500">
                                            <MdPerson className="text-6xl mx-auto mb-4 text-gray-300" />
                                            <p className="text-lg">
                                                No users found
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-[#333333]">
                                Edit User: {editingUser.firstName}{" "}
                                {editingUser.lastName}
                            </h3>
                            <button
                                onClick={() => {
                                    setEditingUser(null);
                                    setEditMode("profile");
                                }}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        {/* Edit Mode Tabs */}
                        <div className="flex gap-2 mb-6">
                            <button
                                onClick={() => setEditMode("profile")}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                                    editMode === "profile"
                                        ? "bg-[#76C893] text-white"
                                        : "bg-[#F9F5EF] text-[#333333] hover:bg-[#FFB74D]"
                                }`}
                            >
                                Profile
                            </button>
                            <button
                                onClick={() => setEditMode("preferences")}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                                    editMode === "preferences"
                                        ? "bg-[#76C893] text-white"
                                        : "bg-[#F9F5EF] text-[#333333] hover:bg-[#FFB74D]"
                                }`}
                            >
                                Preferences
                            </button>
                            <button
                                onClick={() => setEditMode("security")}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                                    editMode === "security"
                                        ? "bg-[#76C893] text-white"
                                        : "bg-[#F9F5EF] text-[#333333] hover:bg-[#FFB74D]"
                                }`}
                            >
                                Security
                            </button>
                        </div>

                        {/* Edit Forms */}
                        <div>
                            {editMode === "profile" && (
                                <UserProfileForm
                                    user={editingUser}
                                    setUser={handleUserUpdate}
                                    isAdminEdit={true}
                                />
                            )}
                            {editMode === "preferences" && (
                                <UserPreferencesForm
                                    user={editingUser}
                                    setUser={handleUserUpdate}
                                    isAdminEdit={true}
                                />
                            )}
                            {editMode === "security" && (
                                <div className="space-y-6">
                                    <UserPasswordForm
                                        user={editingUser}
                                        setUser={handlePasswordUpdate}
                                        isAdminEdit={true}
                                    />

                                    <div className="border-t border-gray-200 pt-6">
                                        <h4 className="text-lg font-semibold text-[#333333] mb-4">
                                            User Role Management
                                        </h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-[#333333] mb-2">
                                                    Current Role:{" "}
                                                    {editingUser.userType ===
                                                    "admin"
                                                        ? "Admin"
                                                        : "User"}
                                                </label>
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() =>
                                                            handleUserTypeUpdate(
                                                                "user"
                                                            )
                                                        }
                                                        disabled={
                                                            editingUser.userType ===
                                                            "user"
                                                        }
                                                        className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                                                            editingUser.userType ===
                                                            "user"
                                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                : "bg-blue-500 text-white hover:bg-blue-600"
                                                        }`}
                                                    >
                                                        Make Regular User
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleUserTypeUpdate(
                                                                "admin"
                                                            )
                                                        }
                                                        disabled={
                                                            editingUser.userType ===
                                                            "admin"
                                                        }
                                                        className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                                                            editingUser.userType ===
                                                            "admin"
                                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                : "bg-purple-500 text-white hover:bg-purple-600"
                                                        }`}
                                                    >
                                                        Make Admin
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
