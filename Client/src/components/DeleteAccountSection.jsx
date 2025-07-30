import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function DeleteAccountSection({ user }) {
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async (e) => {
        e.preventDefault();
        if (confirm !== "DELETE") {
            toast.error("Type DELETE to confirm");
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            await axios.delete("http://localhost:5000/api/users/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Account deleted");
            localStorage.removeItem("authToken");
            localStorage.removeItem("userData");
            setTimeout(() => navigate("/signup"), 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#FFF3F0] border border-[#FF6F61] rounded-lg p-6 text-center">
            <h3 className="text-lg font-bold text-[#FF6F61] mb-2">
                Danger Zone
            </h3>
            <p className="mb-4 text-[#333333]">
                This will permanently delete your account and all your data.
                This action cannot be undone.
            </p>
            <form
                onSubmit={handleDelete}
                className="flex flex-col items-center gap-4"
            >
                <input
                    type="text"
                    placeholder="Type DELETE to confirm"
                    className="w-full border border-[#FF6F61] rounded-lg px-4 py-2 text-[#333333] bg-transparent outline-none"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className={`py-2 px-6 rounded-lg font-semibold transition-colors duration-200 text-white ${
                        loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#FF6F61] hover:bg-[#FFB74D]"
                    }`}
                >
                    {loading ? "Deleting..." : "Delete Account"}
                </button>
            </form>
        </div>
    );
}
