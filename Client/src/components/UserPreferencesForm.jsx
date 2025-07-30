import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const dietaryOptions = [
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

export default function UserPreferencesForm({ user, setUser }) {
    const [form, setForm] = useState({
        dietaryPreference: user.dietaryPreference || "None",
        favouriteMeal: user.favouriteMeal || "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const payload = { ...form };
            const res = await axios.patch(
                "http://localhost:5000/api/users/me",
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setUser(res.data.user);
            toast.success("Preferences updated!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            <div>
                <select
                    name="dietaryPreference"
                    className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none"
                    value={form.dietaryPreference}
                    onChange={handleChange}
                    required
                >
                    {dietaryOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <input
                    type="text"
                    name="favouriteMeal"
                    placeholder="Favorite Meal"
                    className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none"
                    value={form.favouriteMeal}
                    onChange={handleChange}
                    required
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className={`py-2 rounded-lg font-semibold transition-colors duration-200 text-white ${
                    loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#76C893] hover:bg-[#FFB74D]"
                }`}
            >
                {loading ? "Saving..." : "Save Changes"}
            </button>
        </form>
    );
}
