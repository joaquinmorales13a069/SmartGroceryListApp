import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    FiUser,
    FiMail,
    FiLock,
    FiCalendar,
    FiDroplet,
    FiHeart,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdRestaurant } from "react-icons/md";

export default function Signup() {
    const navigate = useNavigate();

    // Check if user is already authenticated on component mount
    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        if (authToken) {
            // User is already authenticated, redirect to dashboard
            navigate("/dashboard");
        }
    }, [navigate]);

    // Dietary Preferences
    const dietaryPreferences = [
        "Dietary preference",
        "Gluten Free",
        "Vegetarian",
        "Vegan",
        "Dairy Free",
        "Paleo",
        "Keto",
        "Low Carb",
        "High Protein",
        "None",
    ];

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        dateOfBirth: "",
        weight: "",
        height: "",
        dietaryPreferences: "",
        favoriteMeal: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if all required fields are filled
        const requiredFields = [
            "firstName",
            "lastName",
            "email",
            "password",
            "dateOfBirth",
            "weight",
            "height",
            "favoriteMeal",
        ];

        // Check for empty required fields
        const emptyFields = requiredFields.filter(
            (field) => !formData[field].trim()
        );

        // Check if dietary preference is empty or still default
        const isDietaryPreferenceEmpty =
            !formData.dietaryPreferences ||
            formData.dietaryPreferences === "Dietary preference";

        if (emptyFields.length > 0 || isDietaryPreferenceEmpty) {
            toast.error(
                `Please fill in all required fields: ${emptyFields.join(", ")}${
                    isDietaryPreferenceEmpty
                        ? emptyFields.length > 0
                            ? ", dietary preferences"
                            : "dietary preferences"
                        : ""
                }`
            );
            return;
        }

        // Check if dietary preference is still the default value and change it to "None"
        const updatedFormData = { ...formData };
        if (
            updatedFormData.dietaryPreferences === "Dietary preference" ||
            updatedFormData.dietaryPreferences === ""
        ) {
            updatedFormData.dietaryPreferences = "None";
        }

        try {
            // Send data to backend using axios
            const response = await axios.post(
                "http://localhost:5000/api/users/signup",
                updatedFormData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // axios automatically parses JSON response
            const result = response.data;

            // Store the authentication token in localStorage
            if (result.token) {
                localStorage.setItem("authToken", result.token);
                localStorage.setItem("userData", JSON.stringify(result.user));
            }

            toast.success(
                `Welcome ${formData.firstName}, your account has been created!`
            );
            console.log("User created:", result.user);

            // Reset form after successful submission
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                dateOfBirth: "",
                weight: "",
                height: "",
                dietaryPreferences: "",
                favoriteMeal: "",
            });

            // Delay redirect to allow toast to be visible
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000); // 2 second delay
        } catch (error) {
            console.error("Error during signup:", error);

            if (error.response) {
                // Server responded with error status
                const result = error.response.data;
                if (result.errors && Array.isArray(result.errors)) {
                    toast.error(
                        `Registration failed: ${result.errors.join(", ")}`
                    );
                } else {
                    toast.error(
                        `Registration failed: ${
                            result.message || "Unknown error"
                        }`
                    );
                }
            } else if (error.request) {
                // Network error
                toast.error(
                    "Network error. Please check your connection and try again."
                );
            } else {
                // Other error
                toast.error("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#F9F5EF] flex items-center justify-center p-6">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
                <div className="flex flex-col items-center mb-6">
                    <div className="flex items-center gap-2">
                        <MdRestaurant className="text-2xl text-emerald-600" />
                        <h1 className="text-2xl font-bold text-gray-800">
                            <span className="text-emerald-600">dAI</span>
                            <span className="text-gray-700">licious</span>
                        </h1>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Smart Grocery Planning
                    </p>
                    <h2 className="text-lg md:text-xl font-semibold text-[#333333] mt-2">
                        Create a new account
                    </h2>
                </div>
                <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    onSubmit={handleSubmit}
                >
                    {/* First & Last Name */}
                    <div className="flex items-center border border-[#76C893] rounded-lg px-4 py-2">
                        <FiUser className="text-[#76C893] mr-2" size={20} />
                        <input
                            type="text"
                            placeholder="First Name"
                            className="w-full bg-transparent outline-none text-[#333333]"
                            value={formData.firstName}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    firstName: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className="flex items-center border border-[#76C893] rounded-lg px-4 py-2">
                        <FiUser className="text-[#76C893] mr-2" size={20} />
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="w-full bg-transparent outline-none text-[#333333]"
                            value={formData.lastName}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    lastName: e.target.value,
                                })
                            }
                            required
                        />
                    </div>

                    {/* Email & Password */}
                    <div className="flex items-center border border-[#76C893] rounded-lg px-4 py-2">
                        <FiMail className="text-[#76C893] mr-2" size={20} />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full bg-transparent outline-none text-[#333333]"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className="flex items-center border border-[#76C893] rounded-lg px-4 py-2">
                        <FiLock className="text-[#76C893] mr-2" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-transparent outline-none text-[#333333]"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                            required
                        />
                    </div>

                    {/* Date of Birth */}
                    <div className="flex items-center border border-[#76C893] rounded-lg px-4 py-2 md:col-span-2">
                        <FiCalendar className="text-[#76C893] mr-2" size={20} />
                        <input
                            type="date"
                            className="w-full bg-transparent outline-none text-[#333333]"
                            value={formData.dateOfBirth}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    dateOfBirth: e.target.value,
                                })
                            }
                            required
                        />
                    </div>

                    {/* Weight & Height */}
                    <div className="flex items-center border border-[#76C893] rounded-lg px-4 py-2">
                        <FiDroplet className="text-[#76C893] mr-2" size={20} />
                        <input
                            type="number"
                            placeholder="Weight (kg)"
                            className="w-full bg-transparent outline-none text-[#333333]"
                            value={formData.weight}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    weight: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className="flex items-center border border-[#76C893] rounded-lg px-4 py-2">
                        <FiDroplet className="text-[#76C893] mr-2" size={20} />
                        <input
                            type="number"
                            placeholder="Height (cm)"
                            className="w-full bg-transparent outline-none text-[#333333]"
                            value={formData.height}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    height: e.target.value,
                                })
                            }
                            required
                        />
                    </div>

                    {/* Dietary Preferences */}
                    <div className="flex items-center border border-[#76C893] rounded-lg px-4 py-2 md:col-span-2">
                        <FiHeart className="text-[#76C893] mr-2" size={20} />
                        <select
                            className="w-full bg-transparent outline-none text-[#333333]"
                            value={formData.dietaryPreferences}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    dietaryPreferences: e.target.value,
                                })
                            }
                            required
                        >
                            {dietaryPreferences.map((preference) => (
                                <option key={preference} value={preference}>
                                    {preference}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Favorite Meal */}
                    <div className="flex items-center border border-[#76C893] rounded-lg px-4 py-2 md:col-span-2">
                        <FiHeart className="text-[#76C893] mr-2" size={20} />
                        <input
                            type="text"
                            placeholder="Favorite Meal"
                            className="w-full bg-transparent outline-none text-[#333333]"
                            value={formData.favoriteMeal}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    favoriteMeal: e.target.value,
                                })
                            }
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="md:col-span-2 mt-4 bg-[#76C893] hover:bg-[#FFB74D] text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        Sign Up
                    </button>

                    {/* Redirect to Login */}
                    <div className="md:col-span-2 text-center mt-2">
                        <p className="text-sm text-[#333333]">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-[#FF6F61] font-medium hover:underline"
                            >
                                Log in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
}
