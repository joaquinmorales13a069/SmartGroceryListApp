import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function UserProfileForm({ user, setUser }) {
    const [form, setForm] = useState({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        currentEmail: "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
        weight: user.weight || "",
        height: user.height || "",
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
            if (form.email !== user.email)
                payload.currentEmail = form.currentEmail;
            const res = await axios.patch(
                "http://localhost:5000/api/users/me",
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setUser(res.data.user);
            toast.success("Profile updated!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            <div className="flex gap-4">
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                {form.email !== user.email && (
                    <input
                        type="email"
                        name="currentEmail"
                        placeholder="Confirm Current Email"
                        className="w-full mt-2 border border-[#FFB74D] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none"
                        value={form.currentEmail}
                        onChange={handleChange}
                        required
                    />
                )}
            </div>
            <div className="flex gap-4">
                <input
                    type="date"
                    name="dateOfBirth"
                    className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="weight"
                    placeholder="Weight (kg)"
                    className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none"
                    value={form.weight}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="height"
                    placeholder="Height (cm)"
                    className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none"
                    value={form.height}
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
