"use server";

import { auth } from "@/app/utils/auth/auth";
import dbConnect from "@/app/db/mongo";
import Property from "@/app/db/models/Property";

// Get all user's properties
export default async function getUserProperties() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    dbConnect();

    if (!userId) {
      return [];
    }

    const allProperties = await Property.find({
      owner: userId,
    }).lean();

    const allPropertiesAsJSON = JSON.parse(JSON.stringify(allProperties));
    return allPropertiesAsJSON;
  } catch (error) {
    return [];
  }
}
