// import { NextResponse } from "next/server";

// import { connectDB } from "@/lib/db";
// import Team from "@/model/Team";

// export const dynamic = "force-dynamic";

// export async function GET() {
//   try {
//     await connectDB();

//     const team = await Team.find()
//       .select("name role intro photo social marketing advisory closing createdAt")
//       .sort({ createdAt: 1 })
//       .lean();

//     return NextResponse.json({ team });
//   } catch (error) {
//     console.error("Get public team error:", error);

//     return NextResponse.json(
      
//       { message: "Unable to load team members" },
//       { status: 500 },
//     );
//   }
// }


import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Team from "@/model/Team";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const team = await Team.find()
      .select(
        "name role intro photo social marketing advisory closing createdAt"
      )
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ team });
  } catch (error) {
    console.error("Get public team error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to load team members",
      },
      { status: 500 }
    );
  }
}