"use server";

import { auth } from "@/app/utils/auth/auth";
import dbConnect from "@/app/db/mongo";
import Property from "@/app/db/models/Property";
import User from "@/app/db/models/User";

interface IBookMark {
  name: string;
  email: string;
  image: string;
  role: string;
  bookmarks: string[];
}

export default async function getUserBookmarks() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!session || !userId) {
      return [];
    }
    await dbConnect();

    const userBookmarks = (await User.findById(userId)
      .select("bookmarks")
      .lean()) as IBookMark;

    const getPropertiesData = await Property.find({
      _id: { $in: userBookmarks.bookmarks },
    }).lean();

    return JSON.parse(JSON.stringify(getPropertiesData));
  } catch (error) {
    console.log("Error", error);
    return [];
  }
}
