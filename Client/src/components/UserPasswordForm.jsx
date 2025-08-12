import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function UserPasswordForm({
    user,
    setUser,
    isAdminEdit = false,
}) {
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
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
            if (isAdminEdit) {
                // For admin editing, directly call the setUser function passed as prop
                // Only send the new password for admin password changes
                await setUser({ newPassword: form.newPassword });
            } else {
                // For regular user editing, use the existing logic
                const token = localStorage.getItem("authToken");
                const payload = {
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword,
                };
                const res = await axios.patch(
                    "http://localhost:5000/api/users/me",
                    payload,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setUser(res.data.user);
                toast.success("Password updated!");
            }
            setForm({ currentPassword: "", newPassword: "" });
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Password update failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            {!isAdminEdit && (
                <input
                    type="password"
                    name="currentPassword"
                    placeholder="Current Password"
                    className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none"
                    value={form.currentPassword}
                    onChange={handleChange}
                    required={!isAdminEdit}
                />
            )}
            <input
                type="password"
                name="newPassword"
                placeholder={isAdminEdit ? "New Password" : "New Password"}
                className="w-full border border-[#76C893] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none"
                value={form.newPassword}
                onChange={handleChange}
                required
            />
            <button
                type="submit"
                disabled={loading}
                className={`py-2 rounded-lg font-semibold transition-colors duration-200 text-white ${
                    loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#76C893] hover:bg-[#FFB74D]"
                }`}
            >
                {loading
                    ? "Saving..."
                    : isAdminEdit
                    ? "Change Password"
                    : "Change Password"}
            </button>
        </form>
    );
}
