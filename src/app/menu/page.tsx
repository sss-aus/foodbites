"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

// Define TypeScript Types for MongoDB
interface Category {
  _id: string; // Use MongoDB `_id`
  name: string;
}

interface MenuItem {
  _id: string; // Use MongoDB `_id`
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string; // Ensure consistency with MongoDB
}

export default function ClientMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [tableNumber, setTableNumber] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [numberOfGuests, setNumberOfGuests] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [extras, setExtras] = useState<string[]>([]);
  const [isOrdering, setIsOrdering] = useState<boolean>(false);

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await fetch("/api/menu");
      if (!res.ok) throw new Error("Failed to fetch menu items");
      const data = await res.json(); // Define `data` here
      const formattedData: MenuItem[] = data.map((item: any) => ({
        _id: item._id,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        // Extract categoryId properly: if it's an object with an _id, extract that; otherwise convert directly.
        categoryId:
          typeof item.categoryId === "object" && item.categoryId._id
            ? String(item.categoryId._id)
            : String(item.categoryId),
      }));
      console.log("Fetched Menu Items:", formattedData);
      setMenuItems(formattedData);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data: Category[] = await res.json();
      // Convert category _id to string for consistency
      const formattedCategories = data.map((cat) => ({
        ...cat,
        _id: String(cat._id),
      }));
      console.log("Fetched Categories:", formattedCategories);
      setCategories(formattedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const filteredMenu = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === null || item.categoryId === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    console.log(
      `Filtering "${item.name}": category ${item.categoryId} vs selected ${selectedCategory}, matchesCategory=${matchesCategory}, matchesSearch=${matchesSearch}`
    );

    return matchesCategory && matchesSearch;
  });

  const openOrderDialog = (item: MenuItem) => {
    setSelectedItem(item);
    setIsOrdering(true);
  };

  const closeOrderDialog = () => {
    setSelectedItem(null);
    setIsOrdering(false);
    setTableNumber("");
    setUserName("");
    setNumberOfGuests("");
    setQuantity(1);
    setExtras([]);
  };

  const placeOrder = async () => {
    if (!selectedItem || !tableNumber || !userName || !numberOfGuests) {
      alert("All fields are required.");
      return;
    }

    const orderData = {
      tableNumber,
      userName,
      numberOfGuests,
      items: [
        {
          menuItemId: selectedItem._id,
          name: selectedItem.name,
          price: selectedItem.price,
          quantity,
          extras,
          categoryId: String(selectedItem.categoryId),
        },
      ],
      status: "pending",
    };

    console.log("Sending Order Data:", JSON.stringify(orderData, null, 2));

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      console.log("Order Response Status:", res.status);

      if (!res.ok) throw new Error("Failed to place order");

      closeOrderDialog();
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="bg-[#181818] min-h-screen text-white p-6">
      <h1 className="text-4xl font-bold text-center text-green-400 mb-6">
        🍔 Our Menu
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 rounded bg-[#303030] w-full max-w-md text-white outline-none border border-[#202020]"
        />
      </div>

      {/* Category Filters */}
      <div className="flex justify-center flex-wrap gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            selectedCategory === null ? "bg-green-500" : "bg-[#303030]"
          } text-white`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            className={`px-4 py-2 rounded ${
              selectedCategory === cat._id ? "bg-green-500" : "bg-[#303030]"
            } text-white`}
            onClick={() => setSelectedCategory(cat._id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenu.map((item) => (
          <div key={item._id} className="bg-[#202020] p-4 rounded-lg shadow-md">
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={300}
              height={200}
              className="w-full h-40 object-cover rounded"
              unoptimized
            />
            <h3 className="text-2xl font-bold mt-2">{item.name}</h3>
            <p className="text-gray-400">{item.description}</p>
            <p className="text-green-300 font-bold text-lg">
              ${item.price.toFixed(2)}
            </p>
            <button
              onClick={() => openOrderDialog(item)}
              className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-black font-semibold"
            >
              Order
            </button>
          </div>
        ))}
      </div>

      {isOrdering && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#202020] p-6 rounded-lg shadow-lg text-white max-w-md w-full">
            <h2 className="text-2xl font-bold">Order {selectedItem.name}</h2>
            <input
              type="number"
              min="1"
              className="w-full p-2 bg-[#303030] rounded mt-2"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <input
              type="text"
              className="w-full p-2 bg-[#303030] rounded mt-2"
              placeholder="Table Number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />
            <input
              type="text"
              className="w-full p-2 bg-[#303030] rounded mt-2"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="number"
              className="w-full p-2 bg-[#303030] rounded mt-2"
              placeholder="Number of Guests"
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(e.target.value)}
            />
            <textarea
              className="w-full p-2 bg-[#303030] rounded mt-2"
              placeholder="Add-ons (Optional)"
              value={extras.join(", ")}
              onChange={(e) => setExtras(e.target.value.split(","))}
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={closeOrderDialog}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded"
              >
                Cancel
              </button>
              <button
                onClick={placeOrder}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
