import dbConnect from "@/app/db/mongo";
import User from "@/app/db/models/User";
import { NextRequest, NextResponse } from "next/server";

// GET: get all users
export const GET = async (req: NextRequest) => {
  try {
    await dbConnect();
    const users = await User.find({}).lean();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    NextResponse.json(error, { status: 500 });
  }
};
