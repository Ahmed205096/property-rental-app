import dbConnect from "@/app/db/mongo";
import Property from "@/app/db/models/Property";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

interface IParams {
  params: Promise<{ id: string }>;
}

export const GET = async (_req: Request, { params }: IParams) => {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid property id" },
        { status: 400 },
      );
    }

    await dbConnect();
    const property = await Property.findById(id).lean();

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(property, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to get property";

    return NextResponse.json({ error: message }, { status: 500 });
  }
};
