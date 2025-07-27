// File: Pantry.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import PantrySummaryChart from "./PantrySummaryChart";
import "react-toastify/dist/ReactToastify.css";
import { FiSearch, FiShoppingBag, FiDollarSign } from "react-icons/fi";
import { MdOutlineInventory } from "react-icons/md";


export default function Pantry() {
  const token = localStorage.getItem("token");

  const [pantryItems, setPantryItems] = useState([]);
  const [budget, setBudget] = useState(0);
  const [newBudget, setNewBudget] = useState("");
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    unit: "pcs",
    category: "",
    expiryDate: "",
    description: "",
    price: "",
    nutrition: [],
  });
  const [nutritionInput, setNutritionInput] = useState({ type: "", value: "" });
  const [editItem, setEditItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const nutritionOptions = ["Calories", "Protein", "Carbs", "Fat", "Fiber", "Sugar"];

  const categoryOptions = [
    "General", "Fruits", "Vegetables", "Dairy", "Grains", "Meat", "Beverages", "Snacks", "Frozen"
  ];

  useEffect(() => {
    fetchPantryItems();
    fetchBudget();
  }, []);

  const fetchPantryItems = async () => {
    try {
      const res = await axios.get("/api/pantry", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedItems = res.data.sort((a, b) => new Date(a.expiryDate || "9999-12-31") - new Date(b.expiryDate || "9999-12-31"));
      setPantryItems(sortedItems);
    } catch (error) {
      console.error("Error fetching pantry items:", error);
    }
    console.log(res.data);
  };
    

  const fetchBudget = async () => {
    try {
      const res = await axios.get("/api/budget", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudget(res.data.amount);
    } catch (error) {
      console.error("Failed to fetch budget.");
    }
  };

  const handleBudgetUpdate = async () => {
    try {
      const res = await axios.put("/api/budget", { amount: newBudget }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudget(res.data.amount);
      toast.success("Budget updated!");
      setNewBudget("");
    } catch (error) {
      console.error("Failed to update budget.");
      toast.error("Error updating budget.");
    }
  };

  const handleAddNutrition = () => {
    if (!nutritionInput.type || !nutritionInput.value) return;
    setNewItem({
      ...newItem,
      nutrition: [...newItem.nutrition, { ...nutritionInput }],
    });
    setNutritionInput({ type: "", value: "" });
  };

  const handleAdd = async () => {
    try {
      const preparedItem = {
        ...newItem,
        price: Number(newItem.price),

      };
      const res = await axios.post("/api/pantry", preparedItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPantryItems([...pantryItems, res.data]);
      setBudget((prev) => prev - preparedItem.price);
      toast.success("Item added!");
      setNewItem({
        name: "", quantity: 1, unit: "pcs", category: "", expiryDate: "", description: "", price: "", nutrition: [],
      });
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/pantry/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPantryItems(pantryItems.filter((item) => item._id !== id));
      toast.success("Item deleted.");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item.");
    }
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const res = await axios.put(`/api/pantry/${editItem._id}`, editItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPantryItems(pantryItems.map((item) => item._id === editItem._id ? res.data : item));
      setIsEditModalOpen(false);
      setEditItem(null);
      toast.success("Item updated!");
    } catch (error) {
      console.error("Error editing item:", error);
      toast.error("Failed to update item.");
    }
  };

  const filteredItems = pantryItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalSpent = pantryItems.reduce((acc, item) => acc + (item.price || 0), 0);
  const remaining = Math.max(budget - totalSpent, 0);
  const percentSpent = budget ? Math.min((totalSpent / budget) * 100, 100) : 0;

  const getTopCategories = () => {
  const categoryCount = {};
  pantryItems.forEach(item => {
    if (item.category) {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + item.quantity;
    }
  });

  const sorted = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return sorted;
};
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
  <MdOutlineInventory className="text-green-600" />
  My Pantry</h2>

      {/* Budget Section */}
    <div className="mb-6 bg-white p-6 rounded-xl shadow-md border border-gray-200">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-xl font-bold flex items-center gap-2 text-green-700">
      💰 Budget Tracker
    </h3>
    <div className="text-sm text-gray-600 italic">Track your grocery spending</div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <input
      type="number"
      placeholder="Enter monthly budget ($)"
      value={newBudget}
      onChange={(e) => setNewBudget(e.target.value)}
      className="border p-2 rounded w-full focus:ring-2 focus:ring-green-300"
    />
    <button
      onClick={handleBudgetUpdate}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
    >
      Update Budget
    </button>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
    <div className="bg-green-100 px-4 py-3 rounded-md shadow-sm">
      <p className="font-semibold">💵 Total Budget</p>
      <p className="text-xl font-bold text-green-700">${budget.toFixed(2)}</p>
    </div>
    <div className="bg-blue-100 px-4 py-3 rounded-md shadow-sm">
      <p className="font-semibold">📉 Spent</p>
      <p className="text-xl font-bold text-blue-700">${totalSpent.toFixed(2)}</p>
    </div>
    <div className={`${remaining <= 0 ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"} px-4 py-3 rounded-md shadow-sm`}>
      <p className="font-semibold">💰 Remaining</p>
      <p className="text-xl font-bold">${remaining.toFixed(2)}</p>
    </div>
  </div>

  <div className="mt-4">
    <div className="h-4 rounded-full bg-gray-200 overflow-hidden">
      <div
        className={`h-4 ${percentSpent >= 100 ? "bg-red-600" : percentSpent >= 75 ? "bg-yellow-500" : "bg-green-500"}`}
        style={{ width: `${percentSpent}%` }}
      ></div>
    </div>
    <div className="text-right text-xs mt-1 text-gray-500">
      {percentSpent.toFixed(1)}% of your budget used
    </div>
  </div>
</div>

      {/* Add Item */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input type="text" placeholder="Item name" value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="border p-2 rounded" />
        <input type="number" min={1} placeholder="Quantity" value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} className="border p-2 rounded" />
        <select value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
          className="border p-2 rounded">
          {["pcs", "g", "kg", "ml", "l"].map((u) => <option key={u}>{u}</option>)}
        </select>
        <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          className="border p-2 rounded">
          <option value="">Category</option>
          {categoryOptions.map((cat) => <option key={cat}>{cat}</option>)}
        </select>
        <input type="date" placeholder="Expiry date" value={newItem.expiryDate}
          onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })} className="border p-2 rounded" />
        <input type="text" placeholder="Description" value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className="border p-2 rounded" />
        <input type="number" step="0.01" placeholder="Price ($)" value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })} className="border p-2 rounded" />

    
        <div className="col-span-2 md:col-span-3 flex gap-2">
          <select
            value={nutritionInput.type}
            onChange={(e) => setNutritionInput({ ...nutritionInput, type: e.target.value })}
            className="border p-2 rounded w-1/2"
          >
            <option value="">Select Nutrition Type</option>
            {nutritionOptions.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <input
            type="string"
            placeholder="Value"
            value={nutritionInput.value}
            onChange={(e) => setNutritionInput({ ...nutritionInput, value: e.target.value })}
            className="border p-2 rounded w-1/2"
          />
          <button onClick={handleAddNutrition} className="bg-green-600 text-white px-4 rounded">Add</button>
        </div>
        {newItem.nutrition.length > 0 && (
          <ul className="col-span-2 md:col-span-3 text-sm text-gray-700">
            {newItem.nutrition.map((n, idx) => (
              <li key={idx}>• {n.type}: {n.value}</li>
            ))}
          </ul>
        )}
      </div><br></br>
    

      <button onClick={handleAdd} className="bg-green-600 text-white px-6 py-2 rounded mb-6 hover:bg-green-700">
        Add Item
      </button>
    </div>

      {/* Search */}
      <div className="relative mb-6">
  <input
    type="text"
    placeholder="Search your pantry items..."
    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  <span className="absolute left-3 top-2.5 text-gray-400 text-xl pointer-events-none">🔍</span>
</div>

      

      {/* Item List */}
   {/* Item List */}
<ul className="space-y-4">
  {currentItems.map((item) => (
    <li
      key={item._id}
      className="bg-white rounded-lg shadow-md p-4 transition hover:shadow-lg flex justify-between items-start gap-4"
    >
      <div className="flex-1 space-y-1">
        <p className="text-lg font-semibold text-gray-800">{item.name}</p>
        <p className="text-sm text-gray-500">{item.quantity} {item.unit} • {item.category}</p>

        {item.expiryDate && (
          <p className="text-sm text-red-600">
            📅 Expires: {new Date(item.expiryDate).toLocaleDateString()}
          </p>
        )}
        {item.description && (
          <p className="text-sm italic text-gray-600">{item.description}</p>
        )}

        <p className="text-sm text-green-700 font-medium">
          💲 Price: ${Number(item.price || 0).toFixed(2)}
        </p>

        {/* Nutrition Chips */}
        {item.nutrition && item.nutrition.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {item.nutrition.map((n, idx) => (
              <span
                key={idx}
                className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                {n.type}: {n.value}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 justify-start">
        <button
          title="Edit"
          onClick={() => openEditModal(item)}
          className="bg-green-600 text-white text-sm px-4 py-1 rounded hover:bg-blue-700 transition"
        >
          Edit
        </button>
        <button
          title="Delete"
          onClick={() => handleDelete(item._id)}
          className="bg-red-600 text-white text-sm px-4 py-1 rounded hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </li>
  ))}
</ul>


      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-3">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="text-2xl text-gray-600 hover:text-black disabled:text-gray-300"><FiArrowLeft /></button>
        <span className="px-4 py-1 text-sm font-semibold rounded border">{currentPage}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="text-2xl text-gray-600 hover:text-black disabled:text-gray-300"><FiArrowRight /></button>
      </div>

      {/* Pantry Summary */}
      <div className="mt-10 bg-white shadow-md border border-gray-100 rounded-xl p-6">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-700">
      📊 Pantry Overview
    </h3>
    <span className="text-sm text-gray-500">Top Categories in Stock</span>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Chart */}
    <PantrySummaryChart pantryItems={pantryItems} />

    {/* Top 3 Categories */}
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="font-semibold text-gray-700 mb-2">🏆 Top 3 Stocked Categories</h4>
      <ul className="space-y-2 text-sm">
        {getTopCategories().map(([category, count], idx) => (
          <li key={idx} className="flex justify-between">
            <span className="text-gray-600">{category}</span>
            <span className="font-semibold text-indigo-600">{count} items</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>

      {isEditModalOpen && editItem && (
  <div className="fixed inset-0 bg-white bg-opacity-30 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h3 className="text-xl font-semibold mb-4">Edit Item</h3>
      <div className="space-y-3">
        <input
          type="text"
          value={editItem.name}
          onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
          className="w-full border p-2 rounded"
          placeholder="Name"
        />
        <input
          type="number"
          value={editItem.quantity}
          onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
          className="w-full border p-2 rounded"
          placeholder="Quantity"
        />
        <input
          type="number"
          step="0.01"
          value={editItem.price}
          onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
          className="w-full border p-2 rounded"
          placeholder="Price"
        />
        <input
          type="text"
          value={editItem.description}
          onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
          className="w-full border p-2 rounded"
          placeholder="Description"
        />
        <select
          value={editItem.unit}
          onChange={(e) => setEditItem({ ...editItem, unit: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="pcs">pcs</option>
          <option value="g">g</option>
          <option value="kg">kg</option>
          <option value="ml">ml</option>
          <option value="l">l</option>
        </select>
        <select
          value={editItem.category}
          onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="">Category</option>
          {categoryOptions.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="date"
          value={editItem.expiryDate?.slice(0, 10)}
          onChange={(e) => setEditItem({ ...editItem, expiryDate: e.target.value })}
          className="w-full border p-2 rounded"
        />
        {/* Nutrition Editor in Edit Modal */}
<div className="mt-4">
  <h4 className="font-semibold mb-2">Nutrition Values</h4>
  {editItem.nutrition?.map((n, idx) => (
    <div key={idx} className="flex gap-2 mb-2">
      <input
        type="text"
        value={n.type}
        onChange={(e) => {
          const updated = [...editItem.nutrition];
          updated[idx].type = e.target.value;
          setEditItem({ ...editItem, nutrition: updated });
        }}
        className="border p-1 rounded w-1/2"
        placeholder="Type"
      />
      <input
        type="text"
        value={n.value}
        onChange={(e) => {
          const updated = [...editItem.nutrition];
          updated[idx].value = e.target.value;
          setEditItem({ ...editItem, nutrition: updated });
        }}
        className="border p-1 rounded w-1/2"
        placeholder="Value"
      />
      <button
        onClick={() => {
          const updated = [...editItem.nutrition];
          updated.splice(idx, 1);
          setEditItem({ ...editItem, nutrition: updated });
        }}
        className="text-red-600 hover:text-red-800"
      >
        ❌
      </button>
    </div>
  ))}
  {/* Add New Nutrition Row */}
  <div className="flex gap-2 mt-2">
    <select
      className="border p-1 rounded w-1/2"
      value={nutritionInput.type}
      onChange={(e) => setNutritionInput({ ...nutritionInput, type: e.target.value })}
    >
      <option value="">Type</option>
      {nutritionOptions.map((type) => (
        <option key={type}>{type}</option>
      ))}
    </select>
    <input
      type="text"
      placeholder="Value"
      value={nutritionInput.value}
      onChange={(e) => setNutritionInput({ ...nutritionInput, value: e.target.value })}
      className="border p-1 rounded w-1/2"
    />
    <button
      onClick={() => {
        if (!nutritionInput.type || !nutritionInput.value) return;
        setEditItem({
          ...editItem,
          nutrition: [...(editItem.nutrition || []), { ...nutritionInput }],
        });
        setNutritionInput({ type: "", value: "" });
      }}
      className="bg-blue-600 text-white px-2 rounded"
    >
      ➕
    </button>
  </div>
</div>

      </div>
      <div className="flex justify-end gap-3 mt-4">
        <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-green-300 rounded">Cancel</button>
        <button onClick={handleEditSubmit} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
      </div>
      
    </div>
    
  </div>
)}

    </div>
  );
}
