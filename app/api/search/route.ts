import Property from "@/app/db/models/Property";
import dbConnect from "@/app/db/mongo";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search") as string;

    if (!search) return NextResponse.json([], { status: 404 });

    await dbConnect();

    const search_res = await Property.find({
      $text: {
        $search: search,
      },
    }).lean();

    return NextResponse.json(search_res, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
