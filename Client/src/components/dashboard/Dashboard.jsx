import React, { useState, useEffect } from "react";

function Dashboard() {
    // Mock data - replace with actual API calls
    const [dashboardData, setDashboardData] = useState({
        totalLists: 12,
        categoryStats: [
            { name: "Vegetables", value: 30, color: "#76C893" },
            { name: "Fruits", value: 25, color: "#FFB74D" },
            { name: "Dairy", value: 20, color: "#FF6F61" },
            { name: "Meat", value: 15, color: "#A8E6CF" },
            { name: "Grains", value: 7, color: "#FFD93D" },
            { name: "Others", value: 3, color: "#6C5CE7" },
        ],
        monthlySpending: [
            { month: "Jan", amount: 320 },
            { month: "Feb", amount: 280 },
            { month: "Mar", amount: 350 },
            { month: "Apr", amount: 290 },
            { month: "May", amount: 410 },
        ],
        recentRecipes: [
            {
                name: "Mediterranean Pasta",
                summary: "Fresh tomatoes, olives, and herbs",
                imageUrl: "🍝",
            },
            {
                name: "Chicken Stir Fry",
                summary: "Quick and healthy weeknight dinner",
                imageUrl: "🍗",
            },
            {
                name: "Berry Smoothie Bowl",
                summary: "Antioxidant-rich breakfast option",
                imageUrl: "🫐",
            },
        ],
        pantryItemCount: 47,
        nextList: {
            date: "2025-07-20",
            name: "Weekend Shopping",
        },
    });

    const StatCard = ({ title, value, icon, bgColor = "bg-white" }) => (
        <div
            className={`${bgColor} rounded-lg shadow-md p-6 border border-gray-100`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {value}
                    </p>
                </div>
                <div className="text-4xl">{icon}</div>
            </div>
        </div>
    );

    const PieChart = ({ data, title }) => {
        const total = data.reduce((sum, item) => sum + item.value, 0);

        return (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {title}
                </h3>
                <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                        <svg
                            className="w-32 h-32 transform -rotate-90"
                            viewBox="0 0 100 100"
                        >
                            {data.map((item, index) => {
                                const percentage = (item.value / total) * 100;
                                const strokeDasharray = `${percentage} ${
                                    100 - percentage
                                }`;
                                const strokeDashoffset = data
                                    .slice(0, index)
                                    .reduce(
                                        (sum, prev) =>
                                            sum + (prev.value / total) * 100,
                                        0
                                    );

                                return (
                                    <circle
                                        key={item.name}
                                        cx="50"
                                        cy="50"
                                        r="15.915"
                                        fill="transparent"
                                        stroke={item.color}
                                        strokeWidth="8"
                                        strokeDasharray={strokeDasharray}
                                        strokeDashoffset={-strokeDashoffset}
                                        className="transition-all duration-300"
                                    />
                                );
                            })}
                        </svg>
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                    {data.map((item) => (
                        <div
                            key={item.name}
                            className="flex items-center justify-between text-sm"
                        >
                            <div className="flex items-center">
                                <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: item.color }}
                                ></div>
                                <span className="text-gray-700">
                                    {item.name}
                                </span>
                            </div>
                            <span className="font-medium text-gray-900">
                                {item.value}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const LineChart = ({ data, title, yLabel }) => {
        const maxAmount = Math.max(...data.map((item) => item.amount));

        return (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {title}
                </h3>
                <div className="h-40 flex items-end justify-between space-x-2">
                    {data.map((item) => (
                        <div
                            key={item.month}
                            className="flex flex-col items-center flex-1"
                        >
                            <div
                                className="bg-gradient-to-t from-[#76C893] to-[#A8E6CF] rounded-t-md w-full transition-all duration-300 hover:opacity-80"
                                style={{
                                    height: `${
                                        (item.amount / maxAmount) * 120
                                    }px`,
                                }}
                            ></div>
                            <span className="text-xs text-gray-600 mt-2">
                                {item.month}
                            </span>
                            <span className="text-xs font-medium text-gray-900">
                                {yLabel}
                                {item.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const RecipeCard = ({ recipes, title }) => (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {title}
            </h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
                {recipes.map((recipe, index) => (
                    <div
                        key={index}
                        className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <div className="text-2xl">{recipe.imageUrl}</div>
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                                {recipe.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                                {recipe.summary}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const ReminderCard = ({ title, date, label }) => {
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
            });
        };

        return (
            <div className="bg-gradient-to-r from-[#FFB74D] to-[#FF6F61] rounded-lg shadow-md p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <div className="flex items-center space-x-2">
                    <span className="text-2xl">📅</span>
                    <div>
                        <p className="font-medium">{label}</p>
                        <p className="text-sm opacity-90">{formatDate(date)}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 bg-[#F9F5EF] min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#333333] mb-2">
                        Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Welcome back! Here's your grocery management overview.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Total Grocery Lists */}
                    <StatCard
                        title="Total Grocery Lists"
                        value={dashboardData.totalLists}
                        icon="📝"
                    />

                    {/* Pantry Item Count */}
                    <StatCard
                        title="Pantry Items"
                        value={dashboardData.pantryItemCount}
                        icon="📦"
                    />

                    {/* Item Category Breakdown - spans 2 columns on larger screens */}
                    <div className="md:col-span-2">
                        <PieChart
                            data={dashboardData.categoryStats}
                            title="Item Category Breakdown"
                        />
                    </div>

                    {/* Monthly Spending Tracker - spans 2 columns */}
                    <div className="md:col-span-2 lg:col-span-3">
                        <LineChart
                            data={dashboardData.monthlySpending}
                            title="Monthly Grocery Spending"
                            yLabel="$"
                        />
                    </div>

                    {/* Upcoming Grocery List Reminder */}
                    <ReminderCard
                        title="Next Grocery List"
                        date={dashboardData.nextList.date}
                        label={dashboardData.nextList.name}
                    />

                    {/* Recent Recipes - spans 2 columns */}
                    <div className="md:col-span-2 lg:col-span-2">
                        <RecipeCard
                            recipes={dashboardData.recentRecipes}
                            title="Recent AI Recipes"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
