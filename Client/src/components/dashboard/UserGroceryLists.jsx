import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";

function UserGroceryLists() {
    const [groceryLists, setGroceryLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch all grocery lists for the user
    const fetchGroceryLists = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get(
                "http://localhost:5000/api/grocery-lists",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setGroceryLists(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching grocery lists:", error);
            toast.error("Failed to load grocery lists");
        } finally {
            setLoading(false);
        }
    };

    // Delete a grocery list
    const handleDelete = async (listId, listName) => {
        if (window.confirm(`Are you sure you want to delete "${listName}"?`)) {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.delete(
                    `http://localhost:5000/api/grocery-lists/${listId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.success) {
                    toast.success("Grocery list deleted successfully");
                    fetchGroceryLists(); // Refresh the list
                }
            } catch (error) {
                console.error("Error deleting grocery list:", error);
                toast.error("Failed to delete grocery list");
            }
        }
    };

    // View details of a grocery list
    const handleViewDetails = (listId) => {
        navigate(`/all-grocery-lists/${listId}`);
    };

    // Calculate total price for a list
    const calculateTotalPrice = (items) => {
        return items.reduce((total, item) => {
            const price = item.item?.price || 0;
            return total + price * item.quantity;
        }, 0);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Get status badge styling
    const getStatusBadge = (status) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
        if (status === "active") {
            return `${baseClasses} bg-[#76C893] text-white`;
        } else {
            return `${baseClasses} bg-[#FFB74D] text-white`;
        }
    };

    useEffect(() => {
        fetchGroceryLists();
    }, []);

    if (loading) {
        return (
            <div className="container">
                <Sidebar />
                <div className="main-content">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-[#333333] text-lg">
                            Loading grocery lists...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <Sidebar />
            <div className="main-content">
                <div className="p-6 bg-[#F9F5EF] min-h-screen">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-lg shadow-md">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-[#333333]">
                                    All Grocery Lists
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    Manage and view all your grocery lists
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">
                                                List Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">
                                                Total Items
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">
                                                Total Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">
                                                Created Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {groceryLists.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="7"
                                                    className="px-6 py-4 text-center text-gray-500"
                                                >
                                                    No grocery lists found.
                                                    Create your first list!
                                                </td>
                                            </tr>
                                        ) : (
                                            groceryLists.map((list, index) => (
                                                <tr
                                                    key={list._id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#333333]">
                                                        {list.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                                                        {list.totalItems || 0}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                                                        $
                                                        {calculateTotalPrice(
                                                            list.items
                                                        ).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                                                        {formatDate(
                                                            list.createdAt
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={getStatusBadge(
                                                                list.status
                                                            )}
                                                        >
                                                            {list.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleViewDetails(
                                                                        list._id
                                                                    )
                                                                }
                                                                className="text-[#76C893] hover:text-[#FFB74D] transition-colors"
                                                            >
                                                                View
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        list._id,
                                                                        list.name
                                                                    )
                                                                }
                                                                className="text-[#FF6F61] hover:text-red-700 transition-colors"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
}

export default UserGroceryLists;
