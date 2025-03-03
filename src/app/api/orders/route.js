import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/mongodb";
import Order from "../../../lib/models/Order";

export async function GET() {
  try {
    await connectToDB();
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("items.menuItemId");
    // Convert items to JSON string if needed
    const formattedOrders = orders.map((order) => ({
      ...order.toObject(),
      items: JSON.stringify(order.items),
    }));
    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ status: 500, msg: "Internal Server Error" });
  }
}

export async function POST(request) {
  try {
    await connectToDB();
    const { tableNumber, userName, numberOfGuests, items } =
      await request.json();
    const newOrder = new Order({
      tableNumber,
      userName,
      numberOfGuests,
      items,
    });
    await newOrder.save();
    return NextResponse.json({
      status: 200,
      msg: "Order placed successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json({ status: 500, msg: "Internal Server Error" });
  }
}
