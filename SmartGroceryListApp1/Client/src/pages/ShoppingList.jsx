import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function ShoppingList() {
  const [list, setList] = useState([]);
  const [meals, setMeals] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", category: "", tag: "", mealName: "" });
  const [editItem, setEditItem] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch shopping list
  const fetchList = async () => {
    const res = await axios.get("/api/shopping", { headers });
    setList(res.data);
  };

  // Fetch meal options (if available)
  //const fetchMeals = async () => {
    //try {
      //onst res = await axios.get("/api/meals", { headers }); // Update if your meal route differs
      //setMeals(res.data);
    //} catch (err) {
    //  console.warn("Meal fetch failed (optional)", err);
    //}
  //};

  //useEffect(() => {
   // fetchList();
    //etchMeals();
 //}, []);

  // Summary
  const total = list.length;
  const purchased = list.filter((i) => i.purchased).length;
  const remaining = total - purchased;

  const categories = ["Produce", "Dairy", "Meat", "Bakery", "Other"];

  const handleInput = (field, value) => setNewItem({ ...newItem, [field]: value });

  const addItem = () => {
    if (!newItem.name.trim()) return;
    axios.post("/api/shopping", newItem, { headers })
      .then(res => {
        setList(prev => [...prev, res.data]);
        setNewItem({ name: "", category: "", tag: "", mealName: "" });
      });
  };

  const toggleItem = (id) => {
    axios.patch(`/api/shopping/${id}/toggle`, null, { headers })
      .then(res => {
        setList(prev => prev.map(i => i._id === id ? { ...i, purchased: res.data.purchased } : i));
      });
  };

  const deleteItem = (id) => {
    axios.delete(`/api/shopping/${id}`, { headers })
      .then(() => setList(prev => prev.filter(i => i._id !== id)));
  };

  const handleEditChange = (field, value) => {
    setEditItem({ ...editItem, [field]: value });
  };

  const saveEdit = () => {
    axios.patch(`/api/shopping/${editItem._id}`, editItem, { headers })
      .then(res => {
        setList(prev => prev.map(i => i._id === res.data._id ? res.data : i));
        setEditItem(null);
      });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">🛒 Shopping List</h2>

      {/* Summary */}
      <div className="mb-4 bg-gray-100 p-4 rounded shadow-sm">
        <p className="text-md">
          📦 <strong>Total:</strong> {total} | ✅ <strong>Purchased:</strong> {purchased} | 🕒 <strong>Remaining:</strong> {remaining}
        </p>
      </div>

      {/* Add Item Form */}
      <div className="mb-6 flex flex-wrap gap-2">
        <input
          className="border p-2 rounded w-1/3"
          placeholder="Item name"
          value={newItem.name}
          onChange={(e) => handleInput("name", e.target.value)}
        />
        <select
          className="border p-2 rounded w-1/4"
          value={newItem.category}
          onChange={(e) => handleInput("category", e.target.value)}
        >
          <option value="">Category</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <input
          className="border p-2 rounded w-1/4"
          placeholder="Tag (e.g. Dinner)"
          value={newItem.tag}
          onChange={(e) => handleInput("tag", e.target.value)}
        />
        <select
          className="border p-2 rounded w-1/4"
          value={newItem.mealName}
          onChange={(e) => handleInput("mealName", e.target.value)}
        >
          <option value="">Select Meal</option>
          {meals.map((meal) => (
            <option key={meal._id}>{meal.name}</option>
          ))}
        </select>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={addItem}
        >
          Add
        </button>
      </div>

      {/* Grouped List */}
      {categories.map((cat) => {
        const catItems = list.filter((item) => item.category === cat);
        if (catItems.length === 0) return null;
        return (
          <div key={cat} className="mb-6">
            <h3 className="text-lg font-semibold border-b mb-2">{cat}</h3>
            {catItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.purchased}
                    onChange={() => toggleItem(item._id)}
                  />
                  <span className={`${item.purchased ? "line-through text-gray-500" : ""}`}>
                    {item.name}
                  </span>
                  {item.tag && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      {item.tag}
                    </span>
                  )}
                  {item.mealName && (
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                      🍽 {item.mealName}
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  <FaEdit
                    className="text-blue-500 cursor-pointer"
                    onClick={() => setEditItem(item)}
                  />
                  <FaTrash
                    className="text-red-500 cursor-pointer"
                    onClick={() => deleteItem(item._id)}
                  />
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Edit Item</h3>
            <input
              className="border p-2 rounded w-full mb-2"
              placeholder="Item name"
              value={editItem.name}
              onChange={(e) => handleEditChange("name", e.target.value)}
            />
            <select
              className="border p-2 rounded w-full mb-2"
              value={editItem.category}
              onChange={(e) => handleEditChange("category", e.target.value)}
            >
              <option value="">Category</option>
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
            <input
              className="border p-2 rounded w-full mb-2"
              placeholder="Tag"
              value={editItem.tag}
              onChange={(e) => handleEditChange("tag", e.target.value)}
            />
            <select
              className="border p-2 rounded w-full mb-2"
              value={editItem.mealName}
              onChange={(e) => handleEditChange("mealName", e.target.value)}
            >
              <option value="">Select Meal</option>
              {meals.map((meal) => (
                <option key={meal._id}>{meal.name}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditItem(null)} className="bg-gray-400 px-4 py-2 rounded text-white">Cancel</button>
              <button onClick={saveEdit} className="bg-blue-600 px-4 py-2 rounded text-white">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
