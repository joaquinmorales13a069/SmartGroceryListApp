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

    // Meal plan generation states
    const [mealPlanProgress, setMealPlanProgress] = useState(0);
    const [isMealPlanGenerating, setIsMealPlanGenerating] = useState(false);
    const [mealPlanRetryCount, setMealPlanRetryCount] = useState(0);
    const [mealPlanError, setMealPlanError] = useState(false);

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

                // Check if meal plans are missing and should be generated
                const listData = response.data.data;
                if (!listData.mealPlans || listData.mealPlans.length === 0) {
                    // Check if this is a newly created list (within last 2 minutes)
                    const createdAt = new Date(listData.createdAt);
                    const now = new Date();
                    const timeDiff = (now - createdAt) / 1000 / 60; // in minutes

                    if (timeDiff < 2) {
                        setIsMealPlanGenerating(true);
                        startMealPlanPolling();
                    }
                }
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

    // Start meal plan polling and progress bar
    const startMealPlanPolling = () => {
        setMealPlanProgress(0);
        setMealPlanError(false);

        // Progress bar animation (steady pace over 60 seconds)
        const progressInterval = setInterval(() => {
            setMealPlanProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 2; // Increase by 2% every second (50 seconds total)
            });
        }, 1000);

        // Poll for meal plans every 5 seconds
        const pollInterval = setInterval(async () => {
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

                if (
                    response.data.success &&
                    response.data.data.mealPlans &&
                    response.data.data.mealPlans.length > 0
                ) {
                    clearInterval(pollInterval);
                    clearInterval(progressInterval);
                    setMealPlanProgress(100);
                    setIsMealPlanGenerating(false);
                    setList(response.data.data);
                    toast.success("Meal plans generated successfully!");
                }
            } catch (error) {
                console.error("Error polling for meal plans:", error);
            }
        }, 5000);

        // Timeout after 60 seconds
        setTimeout(() => {
            clearInterval(progressInterval);
            clearInterval(pollInterval);
            if (isMealPlanGenerating) {
                setIsMealPlanGenerating(false);
                setMealPlanError(true);
                setMealPlanProgress(100);
            }
        }, 60000);
    };

    // Retry meal plan generation
    const retryMealPlanGeneration = async () => {
        if (mealPlanRetryCount >= 2) {
            setMealPlanError(true);
            toast.error(
                "Maximum retry attempts reached. Meal plan generation failed."
            );
            return;
        }

        setMealPlanRetryCount((prev) => prev + 1);
        setIsMealPlanGenerating(true);
        setMealPlanError(false);

        try {
            const token = localStorage.getItem("authToken");
            await axios.post(
                `http://localhost:5000/api/grocery-lists/${listId}/generate-meal-plans`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            startMealPlanPolling();
        } catch (error) {
            console.error("Error retrying meal plan generation:", error);
            setIsMealPlanGenerating(false);
            setMealPlanError(true);
            toast.error("Failed to retry meal plan generation");
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
                        <div className="bg-white rounded-lg shadow-md">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-[#333333]">
                                    Meal Plans
                                </h3>
                            </div>
                            <div className="p-6">
                                {isMealPlanGenerating ? (
                                    <div className="text-center py-8">
                                        <div className="mb-4">
                                            <div className="text-lg font-medium text-[#333333] mb-2">
                                                Generating AI Meal Plans...
                                            </div>
                                            <div className="text-sm text-gray-600 mb-4">
                                                Our AI is creating personalized
                                                meal suggestions based on your
                                                ingredients
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="max-w-md mx-auto mb-4">
                                            <div className="bg-gray-200 rounded-full h-3">
                                                <div
                                                    className="bg-[#76C893] h-3 rounded-full transition-all duration-1000 ease-out"
                                                    style={{
                                                        width: `${mealPlanProgress}%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="text-sm text-gray-500 mt-2">
                                                {mealPlanProgress}% Complete
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#76C893]"></div>
                                        </div>
                                    </div>
                                ) : mealPlanError ? (
                                    <div className="text-center py-8">
                                        <div className="text-lg font-medium text-[#FF6F61] mb-2">
                                            Meal Plan Generation Failed
                                        </div>
                                        <div className="text-sm text-gray-600 mb-4">
                                            We encountered an issue generating
                                            your meal plans. You can try again
                                            or continue without meal
                                            suggestions.
                                        </div>
                                        {mealPlanRetryCount < 2 ? (
                                            <button
                                                onClick={
                                                    retryMealPlanGeneration
                                                }
                                                className="px-6 py-2 bg-[#76C893] text-white rounded-lg hover:bg-green-600 transition-colors"
                                            >
                                                Retry Generation (Attempt{" "}
                                                {mealPlanRetryCount + 1}/3)
                                            </button>
                                        ) : (
                                            <div className="text-sm text-gray-500">
                                                Maximum retry attempts reached.
                                                You can still use your grocery
                                                list without meal plans.
                                            </div>
                                        )}
                                    </div>
                                ) : list.mealPlans &&
                                  list.mealPlans.length > 0 ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {list.mealPlans.map((meal, index) => (
                                            <MealPlanCard
                                                key={index}
                                                meal={meal}
                                                index={index}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-8">
                                        <div className="text-lg font-medium mb-2">
                                            No Meal Plans Available
                                        </div>
                                        <div className="text-sm mb-4">
                                            Meal plans will be generated
                                            automatically for new grocery lists.
                                        </div>
                                        <button
                                            onClick={retryMealPlanGeneration}
                                            className="px-6 py-2 bg-[#76C893] text-white rounded-lg hover:bg-green-600 transition-colors"
                                        >
                                            Generate Meal Plans
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroceryList;
