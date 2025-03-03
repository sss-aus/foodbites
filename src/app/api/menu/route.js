import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/mongodb";
import MenuItem from "../../../lib/models/MenuItem";
export async function GET() {
  try {
    await connectToDB();
    const menuItems = await MenuItem.find().populate("categoryId"); // Fetch with category details
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { error: "Error fetching menu items" },
      { status: 500 }
    );
  }
}
export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    console.log("Received Data:", body); // Log request data

    if (!body.categoryId) {
      return NextResponse.json(
        { error: "categoryId is missing" },
        { status: 400 }
      );
    }

    const newMenuItem = new MenuItem(body);
    await newMenuItem.save();

    return NextResponse.json({
      message: "Menu item added",
      menuItem: newMenuItem,
    });
  } catch (error) {
    console.error("Error adding menu item:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
