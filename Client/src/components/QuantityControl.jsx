import React from "react";

const QuantityControl = ({ item, onUpdateQuantity, onRemoveItem }) => {
    const handleQuantityChange = (delta) => {
        const newQuantity = Math.max(1, item.quantity + delta);
        onUpdateQuantity(item._id, newQuantity);
    };

    const handleInputChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        const newQuantity = Math.max(1, value);
        onUpdateQuantity(item._id, newQuantity);
    };

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={() => handleQuantityChange(-1)}
                className="w-8 h-8 bg-red-100 text-red-600 rounded-lg shadow-sm text-sm flex items-center justify-center border border-red-300 hover:bg-red-200 transition-colors duration-200"
            >
                -
            </button>
            <input
                type="number"
                value={item.quantity}
                min="1"
                onChange={handleInputChange}
                className="w-16 text-center text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#76C893] focus:border-transparent"
            />
            <button
                onClick={() => handleQuantityChange(1)}
                className="w-8 h-8 bg-green-100 text-green-600 rounded-lg shadow-sm text-sm flex items-center justify-center border border-green-300 hover:bg-green-200 transition-colors duration-200"
            >
                +
            </button>
            <button
                onClick={() => onRemoveItem(item._id)}
                className="ml-2 px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg shadow-sm border border-red-300 hover:bg-red-200 transition-colors duration-200"
            >
                Remove
            </button>
        </div>
    );
};

export default QuantityControl;
