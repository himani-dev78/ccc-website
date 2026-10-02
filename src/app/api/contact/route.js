import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Contact from "@/model/Contact";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      subject,
      message,
    } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          message: "Name, email and message are required",
        },
        {
          status: 400,
        }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Save contact message
    await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    return NextResponse.json(
      {
        message: "Your message has been sent successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Contact API error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong. Please try again",
      },
      {
        status: 500,
      }
    );
  }
}