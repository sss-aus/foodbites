import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/mongodb";
import Category from "../../../lib/models/Category";

export async function GET() {
  try {
    await connectToDB();
    const categories = await Category.find();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Error fetching categories" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    const { name } = await req.json();
    const newCategory = new Category({ name });
    await newCategory.save();
    return NextResponse.json({
      message: "Category added",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json(
      { error: "Error adding category" },
      { status: 500 }
    );
  }
}
