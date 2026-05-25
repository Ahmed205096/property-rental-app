import dbConnect from "@/app/db/mongo";
import User from "@/app/db/models/User";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// GET: User make this bookmark or not
export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const propertyId = searchParams.get("propertyId");

    if (!userId || !propertyId) {
      return NextResponse.json("Missing userId or propertyId", { status: 400 });
    }

    await dbConnect();

    const user = await User.findById(userId).select("bookmarks").lean();

    if (!user) {
      return NextResponse.json("User not found", { status: 404 });
    }

    const marks = (user.bookmarks || []) as Types.ObjectId[];

    const isBookmark = marks.map((id) => id.toString()).includes(propertyId);

    return NextResponse.json(isBookmark, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json(message, { status: 500 });
  }
};
