import { auth } from "@/app/utils/auth/auth";
import dbConnect from "@/app/db/mongo";
import User from "@/app/db/models/User";
import { NextRequest, NextResponse } from "next/server";

interface IBody {
  bookmark: string;
}

export interface IUser {
  _id: string;
  email: string;
  __v: number;
  bookmarks: string[];
  createdAt: string;
  image: string;
  name: string;
  role: string;
}

// PATCH: Toggle bookmark (Add if not exists, Remove if exists)
export const PATCH = async (req: NextRequest) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!session || !userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const body = (await req.json()) as IBody;

    if (!body?.bookmark) {
      return NextResponse.json("Bookmark ID is required", { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(userId).select("bookmarks").lean();

    if (!user) {
      return NextResponse.json("User not found", { status: 404 });
    }

    const bookmarks = (user.bookmarks || []) as string[];
    const isBookmarked = bookmarks
      .map((id) => id.toString())
      .includes(body.bookmark.toString());

    let updatedUser;
    let message = "";

    if (isBookmarked) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { bookmarks: body.bookmark } },
        { new: true, runValidators: true },
      ).lean();
      message = "removed";
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { bookmarks: body.bookmark } },
        { new: true, runValidators: true },
      ).lean();
      message = "added";
    }

    // 4. الغسيل السريع للداتا عشان الـ Client Component ما يضربش Object plain error
    const cleanUser = JSON.parse(JSON.stringify(updatedUser));

    return NextResponse.json(
      { updatedUser: cleanUser, action: message },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json(message, { status: 500 });
  }
};
// GET: User bookmarks
export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    await dbConnect();

    const user = await User.findById(userId).select("bookmarks").lean();

    if (!user) {
      return NextResponse.json("User not found", { status: 404 });
    }

    return NextResponse.json(user.bookmarks || [], { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json(message, { status: 500 });
  }
};
