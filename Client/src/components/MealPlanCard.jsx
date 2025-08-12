import React from "react";

function MealPlanCard({ meal, index }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow h-full">
            {/* Header with number and title */}
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-[#FFB74D] rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0">
                    {index + 1}
                </div>
                <h3 className="font-semibold text-[#333333] text-lg leading-tight">
                    {meal.name || `Meal ${index + 1}`}
                </h3>
            </div>

            {/* Description */}
            {meal.description && (
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Description
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                        {meal.description}
                    </p>
                </div>
            )}

            {/* Ingredients */}
            {meal.ingredients && meal.ingredients.length > 0 && (
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Ingredients
                    </h4>
                    <ul className="space-y-1">
                        {meal.ingredients.map((ingredient, idx) => (
                            <li
                                key={idx}
                                className="text-xs text-gray-600 flex items-start"
                            >
                                <span className="w-1.5 h-1.5 bg-[#76C893] rounded-full mr-2 mt-1.5 shrink-0"></span>
                                <span className="leading-relaxed">
                                    {ingredient}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Additional Info Row */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                {meal.prepTime && (
                    <div>
                        <span className="font-semibold text-gray-700">
                            Prep Time:
                        </span>
                        <p className="text-gray-600">{meal.prepTime}</p>
                    </div>
                )}
                {meal.cookTime && (
                    <div>
                        <span className="font-semibold text-gray-700">
                            Cook Time:
                        </span>
                        <p className="text-gray-600">{meal.cookTime}</p>
                    </div>
                )}
                {meal.difficulty && (
                    <div>
                        <span className="font-semibold text-gray-700">
                            Difficulty:
                        </span>
                        <p className="text-gray-600">{meal.difficulty}</p>
                    </div>
                )}
                {meal.servings && (
                    <div>
                        <span className="font-semibold text-gray-700">
                            Servings:
                        </span>
                        <p className="text-gray-600">{meal.servings}</p>
                    </div>
                )}
            </div>

            {/* Instructions */}
            {meal.instructions && (
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Instructions
                    </h4>
                    <div className="text-xs text-gray-600 leading-relaxed">
                        {/* Split instructions by numbered steps if they exist */}
                        {meal.instructions
                            .split(/(\d+\.\s)/)
                            .map((part, idx) => {
                                if (/^\d+\.\s$/.test(part)) {
                                    return (
                                        <span
                                            key={idx}
                                            className="font-semibold text-[#76C893]"
                                        >
                                            {part}
                                        </span>
                                    );
                                }
                                return part;
                            })}
                    </div>
                </div>
            )}

            {/* Nutrition Highlights */}
            {meal.nutritionHighlights &&
                meal.nutritionHighlights.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            Nutrition Highlights
                        </h4>
                        <ul className="space-y-1">
                            {meal.nutritionHighlights.map((highlight, idx) => (
                                <li
                                    key={idx}
                                    className="text-xs text-gray-600 flex items-start"
                                >
                                    <span className="w-1.5 h-1.5 bg-[#FFB74D] rounded-full mr-2 mt-1.5 shrink-0"></span>
                                    <span className="leading-relaxed">
                                        {highlight}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
        </div>
    );
}

export default MealPlanCard;
