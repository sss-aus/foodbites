import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongodb";
import Order from "../../../../lib/models/Order";
export async function PUT(request, { params }) {
  try {
    await connectToDB();
    const { id } = await params;
    const { status } = await request.json();

    // Ensure status is valid
    const validStatuses = ["pending", "preparing", "confirmed", "completed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ status: 400, msg: "Invalid status" });
    }

    // Update order status
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedOrder) {
      return NextResponse.json({ status: 404, msg: "Order not found" });
    }

    return NextResponse.json({
      status: 200,
      msg: "Order status updated",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ status: 500, msg: "Internal Server Error" });
  }
}
