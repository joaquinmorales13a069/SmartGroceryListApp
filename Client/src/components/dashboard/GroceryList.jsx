import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import GroceryListItemCard from "../GroceryListItemCard";
import MealPlanCard from "../MealPlanCard";
import Sidebar from "./Sidebar";

function GroceryList() {
    const { listId } = useParams();
    const navigate = useNavigate();
    const [list, setList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch grocery list details
    const fetchGroceryList = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get(
                `http://localhost:5000/api/grocery-lists/${listId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setList(response.data.data);
            } else {
                setError("Failed to fetch grocery list");
            }
        } catch (error) {
            console.error("Error fetching grocery list:", error);
            setError(
                error.response?.data?.message || "Failed to fetch grocery list"
            );
        } finally {
            setLoading(false);
        }
    };

    // Handle delete
    const handleDelete = async () => {
        if (
            window.confirm(`Are you sure you want to delete "${list?.name}"?`)
        ) {
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
                    navigate("/all-grocery-lists");
                }
            } catch (error) {
                console.error("Error deleting grocery list:", error);
                toast.error("Failed to delete grocery list");
            }
        }
    };

    useEffect(() => {
        if (listId) {
            fetchGroceryList();
        }
    }, [listId]);

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Format expiry date
    const formatExpiryDate = (dateString) => {
        if (!dateString) return "Not specified";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Get status badge styling
    const getStatusBadge = (status) => {
        const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
        if (status === "active") {
            return `${baseClasses} bg-[#76C893] text-white`;
        } else {
            return `${baseClasses} bg-[#FFB74D] text-white`;
        }
    };

    // Calculate total price
    const calculateTotalPrice = () => {
        if (!list || !list.items) return 0;
        return list.items.reduce((total, item) => {
            const price = item.item?.price || 0;
            return total + price * item.quantity;
        }, 0);
    };

    if (loading) {
        return (
            <div className="container">
                <Sidebar />
                <div className="main-content">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-[#76C893] text-lg">
                            Loading grocery list...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !list) {
        return (
            <div className="container">
                <Sidebar />
                <div className="main-content">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-[#FF6F61] text-lg">
                            Error: {error || "Grocery list not found"}
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
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="bg-white rounded-lg shadow-md mb-6">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() =>
                                                navigate("/all-grocery-lists")
                                            }
                                            className="text-[#76C893] hover:text-[#FFB74D] transition-colors"
                                        >
                                            ← Back to Lists
                                        </button>
                                        <div>
                                            <h2 className="text-2xl font-bold text-[#333333]">
                                                {list.name}
                                            </h2>
                                            <p className="text-gray-600">
                                                Created on{" "}
                                                {formatDate(list.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span
                                            className={getStatusBadge(
                                                list.status
                                            )}
                                        >
                                            {list.status}
                                        </span>
                                        <button
                                            onClick={handleDelete}
                                            className="px-4 py-2 bg-[#FF6F61] text-white rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            Delete List
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Summary Stats */}
                            <div className="px-6 py-4 bg-gray-50">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">
                                            Total Items
                                        </p>
                                        <p className="text-2xl font-bold text-[#333333]">
                                            {list.totalItems || 0}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">
                                            Total Price
                                        </p>
                                        <p className="text-2xl font-bold text-[#333333]">
                                            ${calculateTotalPrice().toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">
                                            Last Updated
                                        </p>
                                        <p className="text-lg font-semibold text-[#333333]">
                                            {formatDate(list.updatedAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="bg-white rounded-lg shadow-md mb-6">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-[#333333]">
                                    Items
                                </h3>
                            </div>
                            <div className="p-6">
                                {list.items.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8">
                                        No items in this list
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {list.items.map((item, index) => (
                                            <GroceryListItemCard
                                                key={index}
                                                item={item}
                                                index={index}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Meal Plans Section */}
                        {list.mealPlans && list.mealPlans.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-xl font-semibold text-[#333333]">
                                        Meal Plans
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {list.mealPlans.map((meal, index) => (
                                            <MealPlanCard
                                                key={index}
                                                meal={meal}
                                                index={index}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroceryList;
