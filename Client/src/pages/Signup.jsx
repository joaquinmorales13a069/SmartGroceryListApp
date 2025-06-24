import React, { useState } from "react";
import {
    FiUser,
    FiMail,
    FiLock,
    FiCalendar,
    FiDroplet,
    FiHeart,
} from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Signup() {
    // Dietry Preferences
    const dietaryPreferences = [
        "Dietry preference",
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

    const handleSubmit = (e) => {
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
            formData.dietaryPreferences === "Dietry preference";

        if (emptyFields.length > 0 || isDietaryPreferenceEmpty) {
            alert(
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
            updatedFormData.dietaryPreferences === "Dietry preference" ||
            updatedFormData.dietaryPreferences === ""
        ) {
            updatedFormData.dietaryPreferences = "None";
        }

        // Here you can add your form submission logic
        console.log("Form submitted:", updatedFormData);
        // Reset form after submission
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
    };

    return (
        <div className="min-h-screen bg-[#F9F5EF] flex items-center justify-center p-6">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-[#333333] mb-6 text-center">
                    Create Your Account
                </h2>
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
        </div>
    );
}
