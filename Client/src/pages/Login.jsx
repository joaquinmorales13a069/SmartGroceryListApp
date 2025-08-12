import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { MdRestaurant } from "react-icons/md";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Color Palette
// primary:   #76C893  (Fresh Green)
// secondary: #FFB74D  (Light Orange)
// accent:    #FF6F61  (Coral Red)
// background:#F9F5EF  (Warm Cream)
// text:      #333333  (Dark Gray)

export default function Login() {
    const navigate = useNavigate();

    // Check if user is already authenticated on component mount
    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        if (authToken) {
            // User is already authenticated, redirect to dashboard
            navigate("/dashboard");
        }
    }, [navigate]);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return "Email is required";
        if (!emailRegex.test(email))
            return "Please enter a valid email address";
        return "";
    };

    const validatePassword = (password) => {
        if (!password) return "Password is required";
        if (password.length < 6)
            return "Password must be at least 6 characters long";
        return "";
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validate all fields
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);

        const newErrors = {
            email: emailError,
            password: passwordError,
        };

        setErrors(newErrors);

        // Check if there are any validation errors
        const hasErrors = Object.values(newErrors).some(
            (error) => error !== ""
        );

        if (!hasErrors) {
            try {
                // Make API call to login
                const response = await axios.post(
                    "http://localhost:5000/api/users/login",
                    {
                        email: formData.email,
                        password: formData.password,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                const result = response.data;

                // Store the authentication token in localStorage
                if (result.token) {
                    localStorage.setItem("authToken", result.token);
                    localStorage.setItem(
                        "userData",
                        JSON.stringify(result.user)
                    );
                }

                toast.success(`Welcome back, ${result.user.firstName}!`);

                // Reset form
                setFormData({
                    email: "",
                    password: "",
                });

                // Delay redirect to allow toast to be visible
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            } catch (error) {
                console.error("Error during login:", error);

                if (error.response) {
                    // Server responded with error status
                    const result = error.response.data;
                    toast.error(
                        `Login failed: ${result.message || "Unknown error"}`
                    );
                } else if (error.request) {
                    // Network error
                    toast.error(
                        "Network error. Please check your connection and try again."
                    );
                } else {
                    // Other error
                    toast.error(
                        "An unexpected error occurred. Please try again."
                    );
                }
            }
        }

        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9F5EF] p-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
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
                        Login to your account
                    </h2>
                </div>
                <form
                    className="grid grid-cols-1 gap-6"
                    onSubmit={handleSubmit}
                >
                    {/* Email Field */}
                    <div className="flex flex-col gap-1">
                        <div
                            className={`grid grid-cols-[auto_1fr] items-center gap-3 border rounded-lg p-2 focus-within:ring-2 ${
                                errors.email
                                    ? "border-[#FF6F61] focus-within:ring-[#FF6F61]"
                                    : "border-gray-300 focus-within:ring-[#76C893]"
                            }`}
                        >
                            <FaUser className="text-[#76C893]" size={20} />
                            <div className="flex flex-col">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium text-[#333333]"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="you@example.com"
                                    className="w-full px-2 py-1 outline-none text-[#333333]"
                                    required
                                />
                            </div>
                        </div>
                        {errors.email && (
                            <p className="text-sm text-[#FF6F61] px-2">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-1">
                        <div
                            className={`grid grid-cols-[auto_1fr] items-center gap-3 border rounded-lg p-2 focus-within:ring-2 ${
                                errors.password
                                    ? "border-[#FF6F61] focus-within:ring-[#FF6F61]"
                                    : "border-gray-300 focus-within:ring-[#FF6F61]"
                            }`}
                        >
                            <FaLock className="text-[#FF6F61]" size={20} />
                            <div className="flex flex-col">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium text-[#333333]"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="********"
                                    className="w-full px-2 py-1 outline-none text-[#333333]"
                                    required
                                />
                            </div>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-[#FF6F61] px-2">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex justify-center items-center py-2 rounded-lg font-semibold transition-colors duration-200 text-white ${
                            isSubmitting
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#76C893] hover:bg-[#FFB74D]"
                        }`}
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>

                    {/* Register Link */}
                    <p className="text-center text-sm text-[#333333]">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="font-medium text-[#76C893] hover:underline"
                        >
                            Register
                        </Link>
                    </p>
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
