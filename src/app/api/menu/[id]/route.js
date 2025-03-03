import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongodb";
import MenuItem from "../../../../lib/models/MenuItem";
export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const menuItem = await MenuItem.findById(id).populate("categoryId");
    if (!menuItem)
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    return NextResponse.json(menuItem);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return NextResponse.json(
      { error: "Error fetching menu item" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const { name, description, price, imageUrl, categoryId } = await req.json();
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      id,
      { name, description, price, imageUrl, categoryId },
      { new: true }
    );
    if (!updatedMenuItem)
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    return NextResponse.json({
      message: "Menu item updated",
      menuItem: updatedMenuItem,
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      { error: "Error updating menu item" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const deletedMenuItem = await MenuItem.findByIdAndDelete(id);
    if (!deletedMenuItem)
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    return NextResponse.json({ message: "Menu item deleted" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { error: "Error deleting menu item" },
      { status: 500 }
    );
  }
}
