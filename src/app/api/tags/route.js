import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/mongodb";
import Tag from "../../../lib/models/Tag";

export async function GET() {
  try {
    await connectToDB();
    const tags = await Tag.find();
    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ error: "Error fetching tags" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDB();

    const { name } = await req.json();
    const newTag = new Tag({ name });
    await newTag.save();
    return NextResponse.json({ message: "Tag added", tag: newTag });
  } catch (error) {
    console.error("Error adding tag:", error);
    return NextResponse.json({ error: "Error adding tag" }, { status: 500 });
  }
}
