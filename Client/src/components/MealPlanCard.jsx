import React from "react";

function MealPlanCard({ meal, index }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-[#FFB74D] rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {index + 1}
                </div>
                <h3 className="font-semibold text-[#333333] text-lg">
                    {meal.name || `Meal ${index + 1}`}
                </h3>
            </div>

            {meal.description && (
                <p className="text-sm text-gray-600 mb-3">{meal.description}</p>
            )}

            {meal.ingredients && meal.ingredients.length > 0 && (
                <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">
                        Ingredients:
                    </p>
                    <ul className="space-y-1">
                        {meal.ingredients.map((ingredient, idx) => (
                            <li
                                key={idx}
                                className="text-xs text-gray-600 flex items-center"
                            >
                                <span className="w-1 h-1 bg-[#76C893] rounded-full mr-2"></span>
                                {ingredient}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {meal.instructions && (
                <div className="mt-3">
                    <p className="text-xs font-medium text-gray-500 mb-2">
                        Instructions:
                    </p>
                    <p className="text-xs text-gray-600">{meal.instructions}</p>
                </div>
            )}
        </div>
    );
}

export default MealPlanCard;
