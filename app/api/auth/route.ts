import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Server-side validation using secure environment variables
    const validUsername = process.env.USER_NAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    // Check if environment variables are set
    if (!validUsername || !validPassword) {
      console.error("Authentication environment variables not configured");
      return NextResponse.json(
        { error: "Authentication configuration error" },
        { status: 500 }
      );
    }

    // Validate credentials
    if (username === validUsername && password === validPassword) {
      return NextResponse.json({
        success: true,
        message: "Authentication successful",
      });
    } else {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
