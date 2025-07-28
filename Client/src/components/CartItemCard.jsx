import React from "react";
import QuantityControl from "./QuantityControl";

const CartItemCard = ({ item, onUpdateQuantity, onRemoveItem }) => {
    return (
        <div className="flex justify-between items-center p-3 border border-gray-200 hover:bg-gray-50 rounded-lg w-full bg-white shadow-sm transition-colors duration-200">
            <div className="flex flex-1 items-center">
                <div className="w-32 mr-4">
                    <p className="font-semibold text-base truncate w-28 text-[#333333]">
                        {item.name}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                        ${item.price?.toFixed(2) || "N/A"}
                    </p>
                    {item.batchNumber && (
                        <p className="text-xs text-gray-500">
                            Batch: {item.batchNumber}
                        </p>
                    )}
                </div>
                <QuantityControl
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemoveItem={onRemoveItem}
                />
                <div className="w-16 h-16 bg-[#F9F5EF] rounded-xl flex items-center justify-center ml-4">
                    <span className="text-2xl">🛒</span>
                </div>
            </div>
        </div>
    );
};

export default CartItemCard;
