"use client";
import { useEffect, useState } from "react";

// Define TypeScript Types
interface MenuItem {
  _id: number;
  name: string;
}

interface Extra {
  _id: number;
  menu_item_id: number;
  name: string;
  price: number;
}

export default function AdminExtras() {
  const [extras, setExtras] = useState<Extra[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [formData, setFormData] = useState<{
    menu_item_id: string;
    name: string;
    price: string;
  }>({
    menu_item_id: "",
    name: "",
    price: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExtras();
    fetchMenuItems();
  }, []);

  // Fetch Extras
  const fetchExtras = async () => {
    try {
      const res = await fetch("/api/extras");
      if (!res.ok) throw new Error("Failed to fetch extras");
      const data: Extra[] = await res.json();
      setExtras(data);
    } catch (err) {
      console.error("Error fetching extras:", err);
      setError("Failed to load extras. Please try again.");
    }
  };

  // Fetch Menu Items
  const fetchMenuItems = async () => {
    try {
      const res = await fetch("/api/menu");
      if (!res.ok) throw new Error("Failed to fetch menu items");
      const data: MenuItem[] = await res.json();
      setMenuItems(data);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError("Failed to load menu items. Please try again.");
    }
  };

  // Handle Input Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Form (Add or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.menu_item_id || !formData.name || !formData.price) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/extras/${editingId}` : "/api/extras";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menu_item_id: Number(formData.menu_item_id),
          name: formData.name,
          price: parseFloat(formData.price),
        }),
      });

      if (!res.ok) throw new Error("Failed to save extra");

      fetchExtras();
      setFormData({ menu_item_id: "", name: "", price: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Error saving extra:", err);
      setError("Failed to save extra. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Edit Extra
  const handleEdit = (extra: Extra) => {
    setFormData({
      menu_item_id: String(extra.menu_item_id),
      name: extra.name,
      price: String(extra.price),
    });
    setEditingId(extra._id);
  };

  // Delete Extra
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this extra?")) return;

    try {
      const res = await fetch(`/api/extras/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete extra");

      fetchExtras();
    } catch (err) {
      console.error("Error deleting extra:", err);
      setError("Failed to delete extra. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-center text-green-400 mb-6">
        🛠️ Admin Extras Management
      </h1>

      {/* Show Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500 text-white text-center rounded">
          ❌ {error}
        </div>
      )}

      {/* Extras Form */}
      <form
        className="bg-gray-800 p-6 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <select
          name="menu_item_id"
          value={formData.menu_item_id}
          onChange={handleChange}
          className="p-3 rounded bg-gray-700 w-full text-white"
          required
        >
          <option value="">Select Menu Item</option>
          {menuItems.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="name"
          placeholder="Extra Name"
          value={formData.name}
          onChange={handleChange}
          className="p-3 rounded bg-gray-700 w-full mt-4 text-white"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="p-3 rounded bg-gray-700 w-full mt-4 text-white"
          required
        />
        <button
          type="submit"
          className="w-full mt-4 p-3 rounded bg-green-500 hover:bg-green-600 text-gray-900 font-bold transition"
          disabled={loading}
        >
          {loading ? "Saving..." : editingId ? "Update Extra" : "Add Extra"}
        </button>
      </form>

      {/* Extras List */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-center text-yellow-400 mb-4">
          🛠️ Extras
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {extras.length > 0 ? (
            extras.map((extra) => (
              <div
                key={extra._id}
                className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <h3 className="text-xl font-semibold">
                  {extra.name} - ${extra.price.toFixed(2)}
                </h3>
                <div>
                  <button
                    onClick={() => handleEdit(extra)}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-white mr-2"
                  >
                    ✏ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(extra._id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-white"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No extras found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
