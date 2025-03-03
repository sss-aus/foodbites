import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/mongodb";
import Extra from "../../../lib/models/Extra";

export async function GET() {
  try {
    await connectToDB();
    const extras = await Extra.find().populate("menuItemId"); // Fetch extras with referenced menu item
    return NextResponse.json(extras);
  } catch (error) {
    console.error("Error fetching extras:", error);
    return NextResponse.json(
      { error: "Error fetching extras" },
      { status: 500 }
    );
  }
}
export async function POST(req) {
  try {
    await connectToDB();
    const { menuItemId, name, price } = await req.json();

    if (!menuItemId) {
      return NextResponse.json(
        { error: "menuItemId is required" },
        { status: 400 }
      );
    }

    const newExtra = new Extra({ menuItemId, name, price });
    await newExtra.save();
    return NextResponse.json({ message: "Extra added", extra: newExtra });
  } catch (error) {
    console.error("Error adding extra:", error);
    return NextResponse.json({ error: "Error adding extra" }, { status: 500 });
  }
}
