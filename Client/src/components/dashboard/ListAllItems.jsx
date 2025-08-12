import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
    MdEdit,
    MdDelete,
    MdAdd,
    MdSearch,
    MdNavigateNext,
    MdNavigateBefore,
} from "react-icons/md";
import Sidebar from "./Sidebar";
import AddProduct from "./AddProduct";

export default function ListAllItems() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        fetchItems();
    }, [currentPage, searchTerm]);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            const response = await axios.get(
                `http://localhost:5000/api/items?page=${currentPage}&search=${searchTerm}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setItems(response.data.data);
            setTotalPages(response.data.pagination.totalPages);
        } catch (error) {
            toast.error("Failed to fetch items");
            console.error("Error fetching items:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (itemId) => {
        if (!window.confirm("Are you sure you want to delete this item?")) {
            return;
        }

        try {
            const token = localStorage.getItem("authToken");
            await axios.delete(`http://localhost:5000/api/items/${itemId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Item deleted successfully!");
            fetchItems();
        } catch (error) {
            toast.error("Failed to delete item");
            console.error("Error deleting item:", error);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setEditForm({
            name: item.name,
            price: item.price.toString(),
            batchNumber: item.batchNumber || "",
            expiryDate: item.expiryDate
                ? new Date(item.expiryDate).toISOString().split("T")[0]
                : "",
            nutrition: {
                calories: item.nutrition?.calories?.toString() || "",
                protein: item.nutrition?.protein?.toString() || "",
                carbs: item.nutrition?.carbs?.toString() || "",
                fat: item.nutrition?.fat?.toString() || "",
            },
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("authToken");
            const payload = {
                ...editForm,
                price: parseFloat(editForm.price),
                nutrition: {
                    calories: editForm.nutrition.calories
                        ? parseFloat(editForm.nutrition.calories)
                        : undefined,
                    protein: editForm.nutrition.protein
                        ? parseFloat(editForm.nutrition.protein)
                        : undefined,
                    carbs: editForm.nutrition.carbs
                        ? parseFloat(editForm.nutrition.carbs)
                        : undefined,
                    fat: editForm.nutrition.fat
                        ? parseFloat(editForm.nutrition.fat)
                        : undefined,
                },
            };

            // Remove empty nutrition fields
            Object.keys(payload.nutrition).forEach((key) => {
                if (
                    payload.nutrition[key] === undefined ||
                    payload.nutrition[key] === ""
                ) {
                    delete payload.nutrition[key];
                }
            });

            await axios.patch(
                `http://localhost:5000/api/items/${editingItem._id}`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success("Item updated successfully!");
            setEditingItem(null);
            setEditForm({});
            fetchItems();
        } catch (error) {
            toast.error("Failed to update item");
            console.error("Error updating item:", error);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("nutrition.")) {
            const nutritionField = name.split(".")[1];
            setEditForm((prev) => ({
                ...prev,
                nutrition: {
                    ...prev.nutrition,
                    [nutritionField]: value,
                },
            }));
        } else {
            setEditForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const formatNutrition = (nutrition) => {
        if (!nutrition) return "N/A";
        const parts = [];
        if (nutrition.calories) parts.push(`${nutrition.calories} kcal`);
        if (nutrition.protein) parts.push(`P: ${nutrition.protein}g`);
        if (nutrition.carbs) parts.push(`C: ${nutrition.carbs}g`);
        if (nutrition.fat) parts.push(`F: ${nutrition.fat}g`);
        return parts.length > 0 ? parts.join(", ") : "N/A";
    };

    const getStatusBadge = (item) => {
        if (item.disabled) {
            return (
                <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                    Disabled
                </span>
            );
        }
        if (item.expiryDate && new Date(item.expiryDate) < new Date()) {
            return (
                <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 rounded-full">
                    Expired
                </span>
            );
        }
        return (
            <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                Active
            </span>
        );
    };

    if (showAddProduct) {
        return <AddProduct onBack={() => setShowAddProduct(false)} />;
    }

    return (
        <div className="container">
            <Sidebar />
            <div className="main-content">
                <div className="min-h-screen bg-[#F9F5EF] p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-[#333333]">
                                    All Items
                                </h2>
                                <button
                                    onClick={() => setShowAddProduct(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#76C893] text-white rounded-lg font-semibold hover:bg-[#FFB74D] transition-colors duration-200"
                                >
                                    <MdAdd className="text-lg" />
                                    Add New Product
                                </button>
                            </div>

                            {/* Search Bar */}
                            <div className="mb-6">
                                <div className="relative">
                                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                                    <input
                                        type="text"
                                        placeholder="Search items..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="w-full pl-10 pr-4 py-2 border border-[#76C893] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#76C893] focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-500">
                                        Loading items...
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Items Table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left py-3 px-4 font-semibold text-[#333333]">
                                                        Name
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-[#333333]">
                                                        Price
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-[#333333]">
                                                        Nutrition
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-[#333333]">
                                                        Status
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-[#333333]">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map((item) => (
                                                    <tr
                                                        key={item._id}
                                                        className="border-b border-gray-100 hover:bg-gray-50"
                                                    >
                                                        <td className="py-3 px-4">
                                                            <div>
                                                                <div className="font-medium text-[#333333]">
                                                                    {item.name}
                                                                </div>
                                                                {item.batchNumber && (
                                                                    <div className="text-sm text-gray-500">
                                                                        Batch:{" "}
                                                                        {
                                                                            item.batchNumber
                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span className="font-semibold text-[#76C893]">
                                                                $
                                                                {item.price.toFixed(
                                                                    2
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="text-sm text-gray-600 max-w-xs">
                                                                {formatNutrition(
                                                                    item.nutrition
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            {getStatusBadge(
                                                                item
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            item
                                                                        )
                                                                    }
                                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                                                                    title="Edit"
                                                                >
                                                                    <MdEdit className="text-lg" />
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            item._id
                                                                        )
                                                                    }
                                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                                                                    title="Delete"
                                                                >
                                                                    <MdDelete className="text-lg" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-between items-center mt-6">
                                            <div className="text-sm text-gray-600">
                                                Page {currentPage} of{" "}
                                                {totalPages}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        setCurrentPage((prev) =>
                                                            Math.max(
                                                                1,
                                                                prev - 1
                                                            )
                                                        )
                                                    }
                                                    disabled={currentPage === 1}
                                                    className={`p-2 rounded-lg transition-colors duration-200 ${
                                                        currentPage === 1
                                                            ? "text-gray-400 cursor-not-allowed"
                                                            : "text-[#76C893] hover:bg-[#76C893] hover:text-white"
                                                    }`}
                                                >
                                                    <MdNavigateBefore className="text-lg" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setCurrentPage((prev) =>
                                                            Math.min(
                                                                totalPages,
                                                                prev + 1
                                                            )
                                                        )
                                                    }
                                                    disabled={
                                                        currentPage ===
                                                        totalPages
                                                    }
                                                    className={`p-2 rounded-lg transition-colors duration-200 ${
                                                        currentPage ===
                                                        totalPages
                                                            ? "text-gray-400 cursor-not-allowed"
                                                            : "text-[#76C893] hover:bg-[#76C893] hover:text-white"
                                                    }`}
                                                >
                                                    <MdNavigateNext className="text-lg" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-[#333333] mb-6">
                            Edit Item
                        </h3>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#333333] mb-2">
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editForm.name}
                                        onChange={handleEditChange}
                                        className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#333333] mb-2">
                                        Price
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={editForm.price}
                                        onChange={handleEditChange}
                                        step="0.01"
                                        min="0"
                                        className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#333333] mb-2">
                                        Batch Number
                                    </label>
                                    <input
                                        type="text"
                                        name="batchNumber"
                                        value={editForm.batchNumber}
                                        onChange={handleEditChange}
                                        className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#333333] mb-2">
                                        Expiry Date
                                    </label>
                                    <input
                                        type="date"
                                        name="expiryDate"
                                        value={editForm.expiryDate}
                                        onChange={handleEditChange}
                                        className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <h4 className="text-lg font-semibold text-[#333333] mb-4">
                                    Nutrition Information
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#333333] mb-2">
                                            Calories
                                        </label>
                                        <input
                                            type="number"
                                            name="nutrition.calories"
                                            value={editForm.nutrition.calories}
                                            onChange={handleEditChange}
                                            step="0.1"
                                            min="0"
                                            className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#333333] mb-2">
                                            Protein (g)
                                        </label>
                                        <input
                                            type="number"
                                            name="nutrition.protein"
                                            value={editForm.nutrition.protein}
                                            onChange={handleEditChange}
                                            step="0.1"
                                            min="0"
                                            className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#333333] mb-2">
                                            Carbs (g)
                                        </label>
                                        <input
                                            type="number"
                                            name="nutrition.carbs"
                                            value={editForm.nutrition.carbs}
                                            onChange={handleEditChange}
                                            step="0.1"
                                            min="0"
                                            className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#333333] mb-2">
                                            Fat (g)
                                        </label>
                                        <input
                                            type="number"
                                            name="nutrition.fat"
                                            value={editForm.nutrition.fat}
                                            onChange={handleEditChange}
                                            step="0.1"
                                            min="0"
                                            className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-[#76C893] text-white rounded-lg font-semibold hover:bg-[#FFB74D] transition-colors duration-200"
                                >
                                    Update Item
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingItem(null);
                                        setEditForm({});
                                    }}
                                    className="flex-1 py-3 bg-gray-200 text-[#333333] rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
