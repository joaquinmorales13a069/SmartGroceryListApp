import React from "react";

const ItemCard = ({ item, onAddToCart }) => {
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
                        {item.name}
                    </h3>
                    <p className="text-lg font-bold text-[#76C893] mb-1">
                        ${item.price?.toFixed(2) || "N/A"}
                    </p>
                    {item.batchNumber && (
                        <p className="text-xs text-gray-500 mb-3">
                            Batch: {item.batchNumber}
                        </p>
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
