import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongodb";
import User from "../../../../lib/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  const { username, password } = await request.json();

  try {
    await connectToDB(); // Ensure DB connection

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ status: 400, msg: "User not found" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ status: 400, msg: "Wrong password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Store token in httpOnly cookie
    const response = NextResponse.json({
      status: 200,
      msg: "Login success",
      user,
    });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 86400,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ status: 500, msg: "Internal server error" });
  }
}
