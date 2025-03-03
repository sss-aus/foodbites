"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Update Type Definitions
type OrderStatus = "pending" | "preparing" | "confirmed" | "completed";

interface OrderItem {
  menuItemId: any; // e.g., { name: string, price: number }
  quantity: number;
  _id: string;
}

interface Order {
  _id: string;
  tableNumber: string;
  userName: string;
  numberOfGuests: number;
  items: string; // Items is a JSON string, so you'll parse it
  status: OrderStatus;
  createdAt: string; // Ensure your API returns this timestamp (ISO string)
}

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<{
    [key: string]: OrderStatus;
  }>({});
  const [message, setMessage] = useState<string | null>(null);

  // Fetch orders from API on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch all orders from the API
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data: Order[] = await res.json();
      console.log("Fetched Orders:", data);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Filter orders: only include orders created within the last 24 hours
  const recentOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return orderDate >= twentyFourHoursAgo;
  });

  // Group recent orders by their status
  const pendingOrders = recentOrders.filter(
    (order) => order.status === "pending"
  );
  const preparingOrders = recentOrders.filter(
    (order) => order.status === "preparing"
  );
  const confirmedOrders = recentOrders.filter(
    (order) => order.status === "confirmed"
  );
  const completedOrders = recentOrders.filter(
    (order) => order.status === "completed"
  );

  // Analytics calculations:
  // Total orders in the last 24 hours
  // Analytics calculations:
  // Total orders in the last 24 hours (all orders, regardless of status)
  const totalOrders = recentOrders.length;

  // Total sales: sum only completed orders' totals
  const totalSales = recentOrders.reduce((acc, order) => {
    if (order.status !== "completed") return acc; // Only count completed orders
    let orderTotal = 0;
    let parsedItems: OrderItem[] = [];
    if (typeof order.items === "string") {
      try {
        parsedItems = JSON.parse(order.items);
      } catch (error) {
        console.error("Error parsing order items:", error);
      }
    } else if (Array.isArray(order.items)) {
      parsedItems = order.items;
    }
    parsedItems.forEach((item) => {
      // Assumes each menuItemId has a price property
      orderTotal += item.quantity * (item.menuItemId.price || 0);
    });
    return acc + orderTotal;
  }, 0);

  // Order rate: orders per hour for the last 24 hours
  const orderRate = totalOrders / 24;

  // Handle status selection from dropdown
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setSelectedStatus((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));
  };

  // Update Order Status via API call
  const updateOrderStatus = async (orderId: string) => {
    const newStatus = selectedStatus[orderId];
    if (!newStatus) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update order");
      setMessage(`✅ Order ${orderId} status updated to ${newStatus}`);
      fetchOrders(); // Refresh orders after update
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error updating order:", error);
      setMessage("❌ Error updating order. Please try again.");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Logout function
  const handleLogout = () => {
    document.cookie = "auth_token=; Max-Age=0; path=/;";
    router.push("/login");
  };

  // Reusable order card component
  const renderOrderCard = (order: Order) => {
    let parsedItems: OrderItem[] = [];
    if (typeof order.items === "string") {
      try {
        parsedItems = JSON.parse(order.items);
      } catch (error) {
        console.error("Error parsing order items:", error);
      }
    } else if (Array.isArray(order.items)) {
      parsedItems = order.items;
    }
    return (
      <div key={order._id} className="bg-[#202020] p-4 rounded-lg shadow-md">
        <p className="text-lg font-semibold text-green-400">
          Table: {order.tableNumber}
        </p>
        <p className="text-gray-400">Name: {order.userName}</p>
        <p className="text-gray-400">Guests: {order.numberOfGuests}</p>
        <h3 className="text-lg text-yellow-300 mt-2">🛒 Items:</h3>
        <ul className="text-gray-300 text-sm">
          {parsedItems.map((item, index) => (
            <li key={index}>
              {item.quantity} × {item.menuItemId.name}
            </li>
          ))}
        </ul>
        <div className="mt-2">
          <p className="text-gray-400">Status:</p>
          <select
            value={selectedStatus[order._id] || order.status}
            onChange={(e) =>
              handleStatusChange(order._id, e.target.value as OrderStatus)
            }
            className="w-full p-2 rounded bg-[#303030] text-white"
          >
            {["pending", "preparing", "confirmed", "completed"].map(
              (status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              )
            )}
          </select>
        </div>
        <button
          onClick={() => updateOrderStatus(order._id)}
          className="mt-3 px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white font-semibold w-full"
        >
          Save Status
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#181818] text-white p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-green-400">
          🔐 Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Show Success/Error Message */}
      {message && (
        <div
          className="mt-4 p-3 text-white rounded text-center bg-opacity-80"
          style={{ backgroundColor: message.includes("✅") ? "green" : "red" }}
        >
          {message}
        </div>
      )}

      {/* Analytics Section */}
      <div className="mt-6 p-4 bg-[#202020] rounded-lg shadow-md">
        <h2 className="text-2xl text-yellow-300 mb-4">📊 Analytics</h2>
        <p>Total Orders (last 24 hours): {totalOrders}</p>
        <p>Total Sales: ${totalSales.toFixed(2)}</p>
        <p>Order Rate (orders per hour): {orderRate.toFixed(2)}</p>
      </div>

      {/* Orders Sections */}
      <div className="mt-6">
        <h2 className="text-2xl text-yellow-300 mb-4">
          🕒 Recent Orders (Last 24 Hours)
        </h2>

        {/* Pending Orders */}
        <div className="mb-6">
          <h3 className="text-xl text-green-400 mb-2">Pending Orders</h3>
          {pendingOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingOrders.map((order) => renderOrderCard(order))}
            </div>
          ) : (
            <p className="text-gray-400">No pending orders.</p>
          )}
        </div>

        {/* Preparing Orders */}
        <div className="mb-6">
          <h3 className="text-xl text-green-400 mb-2">Preparing Orders</h3>
          {preparingOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {preparingOrders.map((order) => renderOrderCard(order))}
            </div>
          ) : (
            <p className="text-gray-400">No preparing orders.</p>
          )}
        </div>

        {/* Confirmed Orders */}
        <div className="mb-6">
          <h3 className="text-xl text-green-400 mb-2">Confirmed Orders</h3>
          {confirmedOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {confirmedOrders.map((order) => renderOrderCard(order))}
            </div>
          ) : (
            <p className="text-gray-400">No confirmed orders.</p>
          )}
        </div>

        {/* Completed Orders */}
        <div className="mb-6">
          <h3 className="text-xl text-green-400 mb-2">Completed Orders</h3>
          {completedOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedOrders.map((order) => renderOrderCard(order))}
            </div>
          ) : (
            <p className="text-gray-400">No completed orders.</p>
          )}
        </div>
      </div>
    </div>
  );
}
