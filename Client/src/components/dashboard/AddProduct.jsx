import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdAdd, MdClose } from "react-icons/md";
import Sidebar from "./Sidebar";

export default function AddProduct() {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        batchNumber: "",
        expiryDate: "",
        nutrition: {
            calories: "",
            protein: "",
            carbs: "",
            fat: "",
        },
    });
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("nutrition.")) {
            const nutritionField = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                nutrition: {
                    ...prev.nutrition,
                    [nutritionField]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("authToken");
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                nutrition: {
                    calories: formData.nutrition.calories
                        ? parseFloat(formData.nutrition.calories)
                        : undefined,
                    protein: formData.nutrition.protein
                        ? parseFloat(formData.nutrition.protein)
                        : undefined,
                    carbs: formData.nutrition.carbs
                        ? parseFloat(formData.nutrition.carbs)
                        : undefined,
                    fat: formData.nutrition.fat
                        ? parseFloat(formData.nutrition.fat)
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

            const response = await axios.post(
                "http://localhost:5000/api/items",
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success("Product added successfully!");
            setFormData({
                name: "",
                price: "",
                batchNumber: "",
                expiryDate: "",
                nutrition: {
                    calories: "",
                    protein: "",
                    carbs: "",
                    fat: "",
                },
            });
            setShowForm(false);
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to add product";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            price: "",
            batchNumber: "",
            expiryDate: "",
            nutrition: {
                calories: "",
                protein: "",
                carbs: "",
                fat: "",
            },
        });
        setShowForm(false);
    };

    return (
        <div className="container">
            <Sidebar />
            <div className="main-content">
                <div className="min-h-screen bg-[#F9F5EF] p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-[#333333]">
                                    Add New Product
                                </h2>
                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                                        showForm
                                            ? "bg-gray-500 text-white hover:bg-gray-600"
                                            : "bg-[#76C893] text-white hover:bg-[#FFB74D]"
                                    }`}
                                >
                                    {showForm ? (
                                        <>
                                            <MdClose className="text-lg" />
                                            Cancel
                                        </>
                                    ) : (
                                        <>
                                            <MdAdd className="text-lg" />
                                            Add Product
                                        </>
                                    )}
                                </button>
                            </div>

                            {showForm && (
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-[#333333] mb-2">
                                                Product Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none focus:ring-2 focus:ring-[#76C893] focus:border-transparent"
                                                placeholder="Enter product name"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[#333333] mb-2">
                                                Price *
                                            </label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                step="0.01"
                                                min="0"
                                                className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none focus:ring-2 focus:ring-[#76C893] focus:border-transparent"
                                                placeholder="0.00"
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
                                                value={formData.batchNumber}
                                                onChange={handleChange}
                                                className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none focus:ring-2 focus:ring-[#76C893] focus:border-transparent"
                                                placeholder="Enter batch number"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[#333333] mb-2">
                                                Expiry Date *
                                            </label>
                                            <input
                                                type="date"
                                                name="expiryDate"
                                                value={formData.expiryDate}
                                                onChange={handleChange}
                                                className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none focus:ring-2 focus:ring-[#76C893] focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-6">
                                        <h3 className="text-lg font-semibold text-[#333333] mb-4">
                                            Nutrition Information (Optional)
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-[#333333] mb-2">
                                                    Calories
                                                </label>
                                                <input
                                                    type="number"
                                                    name="nutrition.calories"
                                                    value={
                                                        formData.nutrition
                                                            .calories
                                                    }
                                                    onChange={handleChange}
                                                    step="0.1"
                                                    min="0"
                                                    className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none focus:ring-2 focus:ring-[#76C893] focus:border-transparent"
                                                    placeholder="kcal"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-[#333333] mb-2">
                                                    Protein (g)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="nutrition.protein"
                                                    value={
                                                        formData.nutrition
                                                            .protein
                                                    }
                                                    onChange={handleChange}
                                                    step="0.1"
                                                    min="0"
                                                    className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none focus:ring-2 focus:ring-[#76C893] focus:border-transparent"
                                                    placeholder="g"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-[#333333] mb-2">
                                                    Carbs (g)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="nutrition.carbs"
                                                    value={
                                                        formData.nutrition.carbs
                                                    }
                                                    onChange={handleChange}
                                                    step="0.1"
                                                    min="0"
                                                    className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none focus:ring-2 focus:ring-[#76C893] focus:border-transparent"
                                                    placeholder="g"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-[#333333] mb-2">
                                                    Fat (g)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="nutrition.fat"
                                                    value={
                                                        formData.nutrition.fat
                                                    }
                                                    onChange={handleChange}
                                                    step="0.1"
                                                    min="0"
                                                    className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none focus:ring-2 focus:ring-[#76C893] focus:border-transparent"
                                                    placeholder="g"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`flex-1 py-3 rounded-lg font-semibold transition-colors duration-200 text-white ${
                                                loading
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-[#76C893] hover:bg-[#FFB74D]"
                                            }`}
                                        >
                                            {loading
                                                ? "Adding Product..."
                                                : "Add Product"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="flex-1 py-3 rounded-lg font-semibold transition-colors duration-200 text-[#333333] bg-gray-200 hover:bg-gray-300"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            )}

                            {!showForm && (
                                <div className="text-center py-12 text-gray-500">
                                    <MdAdd className="text-6xl mx-auto mb-4 text-gray-300" />
                                    <p className="text-lg">
                                        Click "Add Product" to create a new item
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
