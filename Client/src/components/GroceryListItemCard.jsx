import React from "react";

function GroceryListItemCard({ item, index }) {
    // Format expiry date
    const formatExpiryDate = (dateString) => {
        if (!dateString) return "Not specified";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Calculate item total
    const calculateItemTotal = () => {
        const price = item.item?.price || 0;
        return (price * item.quantity).toFixed(2);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#76C893] rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {index + 1}
                    </div>
                    <h3 className="font-semibold text-[#333333] text-lg">
                        {item.item?.name || "Unknown Item"}
                    </h3>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="font-bold text-[#333333]">
                        ${calculateItemTotal()}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-600">Quantity</p>
                    <p className="font-medium text-[#333333]">
                        {item.quantity}
                    </p>
                </div>
                <div>
                    <p className="text-gray-600">Unit Price</p>
                    <p className="font-medium text-[#333333]">
                        ${item.item?.price?.toFixed(2) || "0.00"}
                    </p>
                </div>
                <div className="col-span-2">
                    <p className="text-gray-600">Expiry Date</p>
                    <p className="font-medium text-[#333333]">
                        {formatExpiryDate(item.expiryDate)}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default GroceryListItemCard;
