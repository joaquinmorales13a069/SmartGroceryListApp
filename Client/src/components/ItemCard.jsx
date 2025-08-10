import React from "react";

const ItemCard = ({ item, onAddToCart }) => {
    const formatName = (name) =>
        name ? name.replace(/\b\w/g, (c) => c.toUpperCase()) : "";
    const { calories, protein, carbs, fat } = item.nutrition || {};
    const hasNutrition = [calories, protein, carbs, fat].some(
        (v) => v !== undefined && v !== null
    );
    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-4 border border-gray-100 h-full">
            <div className="flex flex-col h-full">
                {/* Item Image/Icon */}
                <div className="w-full h-24 bg-[#F9F5EF] rounded-lg flex items-center justify-center mb-3">
                    <span className="text-3xl">🛒</span>
                </div>

                {/* Item Details */}
                <div className="flex-1">
                    <h3 className="font-semibold text-base text-[#333333] mb-2 line-clamp-2">
                        {formatName(item.name)}
                    </h3>
                    <p className="text-lg font-bold text-[#76C893] mb-1">
                        ${item.price?.toFixed(2) || "N/A"}
                    </p>
                    {hasNutrition && (
                        <div className="mb-3">
                            <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                    {calories !== undefined &&
                                        calories !== null && (
                                            <div className="flex items-baseline justify-between">
                                                <span className="text-gray-600">
                                                    Cal
                                                </span>
                                                <span className="font-semibold text-[#333333]">
                                                    {calories}
                                                </span>
                                            </div>
                                        )}
                                    {protein !== undefined &&
                                        protein !== null && (
                                            <div className="flex items-baseline justify-between">
                                                <span className="text-gray-600">
                                                    Prot
                                                </span>
                                                <span className="font-semibold text-[#333333]">
                                                    {protein}g
                                                </span>
                                            </div>
                                        )}
                                    {carbs !== undefined && carbs !== null && (
                                        <div className="flex items-baseline justify-between">
                                            <span className="text-gray-600">
                                                Carbs
                                            </span>
                                            <span className="font-semibold text-[#333333]">
                                                {carbs}g
                                            </span>
                                        </div>
                                    )}
                                    {fat !== undefined && fat !== null && (
                                        <div className="flex items-baseline justify-between">
                                            <span className="text-gray-600">
                                                Fat
                                            </span>
                                            <span className="font-semibold text-[#333333]">
                                                {fat}g
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Add Button */}
                <button
                    onClick={() => onAddToCart(item)}
                    className="w-full mt-auto py-2 px-4 bg-[#76C893] text-white rounded-lg shadow-sm border border-[#76C893] hover:bg-[#FFB74D] hover:border-[#FFB74D] transition-colors duration-200 font-medium text-sm"
                >
                    Add to List
                </button>
            </div>
        </div>
    );
};

export default ItemCard;
