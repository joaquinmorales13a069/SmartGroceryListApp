import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const defaultForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    weight: "",
    height: "",
    dietaryPreference: "None",
    favouriteMeal: "",
    userType: "user",
};

export default function AdminUserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState(defaultForm);
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState(defaultForm);

    const token = localStorage.getItem("authToken");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:5000/api/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data.users);
        } catch (err) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/users", form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("User created");
            setShowCreate(false);
            setForm(defaultForm);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || "Create failed");
        }
    };

    const handleEdit = (user) => {
        setEditId(user._id);
        setEditForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: "",
            dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
            weight: user.weight,
            height: user.height,
            dietaryPreference: user.dietaryPreference,
            favouriteMeal: user.favouriteMeal,
            userType: user.userType,
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(
                `http://localhost:5000/api/users/${editId}`,
                editForm,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success("User updated");
            setEditId(null);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure? This will soft delete the user."))
            return;
        try {
            await axios.delete(`http://localhost:5000/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("User deleted");
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete failed");
        }
    };

    const handlePromoteDemote = async (id, userType) => {
        try {
            await axios.patch(
                `http://localhost:5000/api/users/${id}/type`,
                { userType },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success("User type updated");
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || "Type update failed");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#333333]">
                    User Management
                </h3>
                <button
                    className="bg-[#76C893] hover:bg-[#FFB74D] text-white font-semibold py-2 px-4 rounded-lg"
                    onClick={() => setShowCreate((v) => !v)}
                >
                    {showCreate ? "Cancel" : "Create User"}
                </button>
            </div>
            {showCreate && (
                <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
                    onSubmit={handleCreate}
                >
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        className="border border-[#76C893] rounded-lg px-4 py-2"
                        value={form.firstName}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                firstName: e.target.value,
                            }))
                        }
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        className="border border-[#76C893] rounded-lg px-4 py-2"
                        value={form.lastName}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, lastName: e.target.value }))
                        }
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="border border-[#76C893] rounded-lg px-4 py-2"
                        value={form.email}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, email: e.target.value }))
                        }
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="border border-[#76C893] rounded-lg px-4 py-2"
                        value={form.password}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, password: e.target.value }))
                        }
                        required
                    />
                    <input
                        type="date"
                        name="dateOfBirth"
                        className="border border-[#76C893] rounded-lg px-4 py-2"
                        value={form.dateOfBirth}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                dateOfBirth: e.target.value,
                            }))
                        }
                        required
                    />
                    <input
                        type="number"
                        name="weight"
                        placeholder="Weight (kg)"
                        className="border border-[#76C893] rounded-lg px-4 py-2"
                        value={form.weight}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, weight: e.target.value }))
                        }
                        required
                    />
                    <input
                        type="number"
                        name="height"
                        placeholder="Height (cm)"
                        className="border border-[#76C893] rounded-lg px-4 py-2"
                        value={form.height}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, height: e.target.value }))
                        }
                        required
                    />
                    <select
                        name="dietaryPreference"
                        className="border border-[#76C893] rounded-lg px-4 py-2"
                        value={form.dietaryPreference}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                dietaryPreference: e.target.value,
                            }))
                        }
                        required
                    >
                        <option>Dietary preference</option>
                        <option>Gluten Free</option>
                        <option>Vegetarian</option>
                        <option>Vegan</option>
                        <option>Dairy Free</option>
                        <option>Paleo</option>
                        <option>Keto</option>
                        <option>Low Carb</option>
                        <option>High Protein</option>
                        <option>None</option>
                    </select>
                    <input
                        type="text"
                        name="favouriteMeal"
                        placeholder="Favorite Meal"
                        className="border border-[#76C893] rounded-lg px-4 py-2"
                        value={form.favouriteMeal}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                favouriteMeal: e.target.value,
                            }))
                        }
                        required
                    />
                    <select
                        name="userType"
                        className="border border-[#76C893] rounded-lg px-4 py-2"
                        value={form.userType}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, userType: e.target.value }))
                        }
                        required
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button
                        type="submit"
                        className="md:col-span-2 bg-[#76C893] hover:bg-[#FFB74D] text-white font-semibold py-2 rounded-lg"
                    >
                        Create
                    </button>
                </form>
            )}
            {loading ? (
                <div className="text-center py-6">Loading users...</div>
            ) : (
                <table className="w-full text-left border mt-2">
                    <thead>
                        <tr className="bg-[#F9F5EF]">
                            <th className="p-2">Name</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Type</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id} className="border-t">
                                <td className="p-2">
                                    {u.firstName} {u.lastName}
                                </td>
                                <td className="p-2">{u.email}</td>
                                <td className="p-2">{u.userType}</td>
                                <td className="p-2 flex gap-2 flex-wrap">
                                    <button
                                        className="bg-[#FFB74D] text-white px-2 py-1 rounded"
                                        onClick={() => handleEdit(u)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-[#FF6F61] text-white px-2 py-1 rounded"
                                        onClick={() => handleDelete(u._id)}
                                    >
                                        Delete
                                    </button>
                                    {u.userType === "user" ? (
                                        <button
                                            className="bg-[#76C893] text-white px-2 py-1 rounded"
                                            onClick={() =>
                                                handlePromoteDemote(
                                                    u._id,
                                                    "admin"
                                                )
                                            }
                                        >
                                            Promote
                                        </button>
                                    ) : (
                                        <button
                                            className="bg-[#333333] text-white px-2 py-1 rounded"
                                            onClick={() =>
                                                handlePromoteDemote(
                                                    u._id,
                                                    "user"
                                                )
                                            }
                                        >
                                            Demote
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {editId && (
                <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 bg-[#F9F5EF] p-4 rounded-lg"
                    onSubmit={handleEditSubmit}
                >
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        className="border border-[#76C893] rounded-lg px-4 py-2"
                        value={editForm.firstName}
                        onChange={(e) =>
                            setEditForm((f) => ({
                                ...f,
                                firstName: e.target.value,
                            }))
                        }
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        className="border border-[#76C893] rounded-lg px-4 py-2"
                        value={editForm.lastName}
                        onChange={(e) =>
                            setEditForm((f) => ({
                                ...f,
                                lastName: e.target.value,
                            }))
                        }
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="border border-[#76C893] rounded-lg px-4 py-2"
                        value={editForm.email}
                        onChange={(e) =>
                            setEditForm((f) => ({
                                ...f,
                                email: e.target.value,
                            }))
                        }
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="New Password (leave blank to keep)"
                        className="border border-[#76C893] rounded-lg px-4 py-2"
                        value={editForm.password}
                        onChange={(e) =>
                            setEditForm((f) => ({
                                ...f,
                                password: e.target.value,
                            }))
                        }
                    />
                    <input
                        type="date"
                        name="dateOfBirth"
                        className="border border-[#76C893] rounded-lg px-4 py-2"
                        value={editForm.dateOfBirth}
                        onChange={(e) =>
                            setEditForm((f) => ({
                                ...f,
                                dateOfBirth: e.target.value,
                            }))
                        }
                        required
                    />
                    <input
                        type="number"
                        name="weight"
                        placeholder="Weight (kg)"
                        className="border border-[#76C893] rounded-lg px-4 py-2"
                        value={editForm.weight}
                        onChange={(e) =>
                            setEditForm((f) => ({
                                ...f,
                                weight: e.target.value,
                            }))
                        }
                        required
                    />
                    <input
                        type="number"
                        name="height"
                        placeholder="Height (cm)"
                        className="border border-[#76C893] rounded-lg px-4 py-2"
                        value={editForm.height}
                        onChange={(e) =>
                            setEditForm((f) => ({
                                ...f,
                                height: e.target.value,
                            }))
                        }
                        required
                    />
                    <select
                        name="dietaryPreference"
                        className="border border-[#76C893] rounded-lg px-4 py-2"
                        value={editForm.dietaryPreference}
                        onChange={(e) =>
                            setEditForm((f) => ({
                                ...f,
                                dietaryPreference: e.target.value,
                            }))
                        }
                        required
                    >
                        <option>Dietary preference</option>
                        <option>Gluten Free</option>
                        <option>Vegetarian</option>
                        <option>Vegan</option>
                        <option>Dairy Free</option>
                        <option>Paleo</option>
                        <option>Keto</option>
                        <option>Low Carb</option>
                        <option>High Protein</option>
                        <option>None</option>
                    </select>
                    <input
                        type="text"
                        name="favouriteMeal"
                        placeholder="Favorite Meal"
                        className="border border-[#76C893] rounded-lg px-4 py-2"
                        value={editForm.favouriteMeal}
                        onChange={(e) =>
                            setEditForm((f) => ({
                                ...f,
                                favouriteMeal: e.target.value,
                            }))
                        }
                        required
                    />
                    <select
                        name="userType"
                        className="border border-[#76C893] rounded-lg px-4 py-2"
                        value={editForm.userType}
                        onChange={(e) =>
                            setEditForm((f) => ({
                                ...f,
                                userType: e.target.value,
                            }))
                        }
                        required
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <div className="md:col-span-2 flex gap-2">
                        <button
                            type="submit"
                            className="bg-[#76C893] hover:bg-[#FFB74D] text-white font-semibold py-2 px-4 rounded-lg"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            className="bg-gray-300 text-[#333333] font-semibold py-2 px-4 rounded-lg"
                            onClick={() => setEditId(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
