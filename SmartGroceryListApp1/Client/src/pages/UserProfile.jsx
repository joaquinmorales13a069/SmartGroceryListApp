
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaUser, FaHeartbeat, FaUtensils, FaLock, FaTrash, FaDownload } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [expanded, setExpanded] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const res = await axios.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          dietaryPreference: res.data.dietaryPreference,
          favouriteMeal: res.data.favouriteMeal,
          height: res.data.height,
          weight: res.data.weight,
        });
      } catch (err) {
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const toggleSection = (section) => {
    setExpanded(expanded === section ? "" : section);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put("/api/users/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setEditMode(false);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Update failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handlePasswordChange = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/users/change-password", passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Password changed!");
      setShowPasswordModal(false);
    } catch {
      toast.error("Password change failed.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete("/api/users/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      navigate("/register");
    } catch {
      toast.error("Account deletion failed.");
    }
  };

  const downloadHistory = () => {
    const csv = `Field,Value\nName,${user.fullName}\nEmail,${user.email}\nHeight,${user.height}\nWeight,${user.weight}\nDietary Preference,${user.dietaryPreference}\nFavourite Meal,${user.favouriteMeal}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "user-profile.csv";
    link.click();
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center">👤 User Profile</h2>

      {/* Personal Info */}
      <div className="border rounded p-3">
        <button className="flex items-center w-full justify-between" onClick={() => toggleSection("personal")}>
          <div className="flex items-center gap-2 font-semibold"><FaUser /> Personal Info</div>
          <span>{expanded === "personal" ? "-" : "+"}</span>
        </button>
        {expanded === "personal" && (
          <div className="mt-2 space-y-2">
            <input name="firstName" value={formData.firstName} onChange={handleChange} className="border p-2 w-full rounded" />
            <input name="lastName" value={formData.lastName} onChange={handleChange} className="border p-2 w-full rounded" />
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}
      </div>

      {/* Health */}
      <div className="border rounded p-3">
        <button className="flex items-center w-full justify-between" onClick={() => toggleSection("health")}>
          <div className="flex items-center gap-2 font-semibold"><FaHeartbeat /> Health</div>
          <span>{expanded === "health" ? "-" : "+"}</span>
        </button>
        {expanded === "health" && (
          <div className="mt-2 space-y-2">
            <input name="height" value={formData.height} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Height (cm)" />
            <input name="weight" value={formData.weight} onChange={handleChange} className="border p-2 w-full rounded" placeholder="Weight (kg)" />
          </div>
        )}
      </div>

      {/* Preferences */}
      <div className="border rounded p-3">
        <button className="flex items-center w-full justify-between" onClick={() => toggleSection("preferences")}>
          <div className="flex items-center gap-2 font-semibold"><FaUtensils /> Preferences</div>
          <span>{expanded === "preferences" ? "-" : "+"}</span>
        </button>
        {expanded === "preferences" && (
          <div className="mt-2 space-y-2">
            <input name="dietaryPreference" value={formData.dietaryPreference} onChange={handleChange} className="border p-2 w-full rounded" />
            <input name="favouriteMeal" value={formData.favouriteMeal} onChange={handleChange} className="border p-2 w-full rounded" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-between items-center gap-2 mt-4">
        <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
        <button onClick={() => setShowPasswordModal(true)} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center gap-1"><FaLock /> Change Password</button>
        <button onClick={handleDeleteAccount} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-1"><FaTrash /> Delete</button>
        <button onClick={downloadHistory} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1"><FaDownload /> Download</button>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full space-y-3">
            <h3 className="text-lg font-semibold">Change Password</h3>
            <input type="password" name="currentPassword" placeholder="Current Password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="border p-2 w-full rounded" />
            <input type="password" name="newPassword" placeholder="New Password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="border p-2 w-full rounded" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowPasswordModal(false)} className="px-3 py-1 rounded bg-gray-300">Cancel</button>
              <button onClick={handlePasswordChange} className="px-3 py-1 rounded bg-blue-600 text-white">Change</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserProfile;
