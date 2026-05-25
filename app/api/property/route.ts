import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/app/db/mongo";
import Property from "@/app/db/models/Property";
import cloudinary from "@/app/utils/cloudinaryConfig";
import { auth } from "@/app/utils/auth/auth";
import mongoose from "mongoose";

interface IAddPropertyFormFields {
  owner: string;
  type: string;
  title: string;
  description: string;
  location: {
    city: string;
    state: string;
    zipcode: string;
    street: string;
  };
  beds: number;
  baths: number;
  sqft: number;
  amenities: string[];
  rates: {
    nightly: number;
    weekly: number;
    monthly: number;
  };
  images: string[];
}

export const POST = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as IAddPropertyFormFields;

    const bodySchema = z.object({
      owner: z.string().length(24),
      type: z.string().min(1),
      title: z.string().min(1),
      description: z.string().min(1),
      location: z.object({
        city: z.string().min(1),
        state: z.string().min(1),
        zipcode: z.string().min(1),
        street: z.string().min(1),
      }),
      beds: z.number(),
      baths: z.number(),
      sqft: z.number(),
      amenities: z.array(z.string()),
      rates: z.object({
        nightly: z.number(),
        weekly: z.number(),
        monthly: z.number(),
      }),
      images: z.array(z.string().startsWith("data:image/")).min(1),
    });

    const verifyBody = bodySchema.safeParse(body);

    if (!verifyBody.success) {
      return NextResponse.json(
        {
          error: "Invalid properties",
          details: verifyBody.error.issues[0],
        },
        { status: 400 },
      );
    }

    const uploadedImages = [];

    for (const base64Image of body.images) {
      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "rent_property/images",
      });

      uploadedImages.push({
        url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id,
      });
    }

    const propertyData = {
      ...body,
      beds: Number(body.beds),
      baths: Number(body.baths),
      sqft: Number(body.sqft),
      rates: {
        nightly: Number(body.rates.nightly),
        weekly: Number(body.rates.weekly),
        monthly: Number(body.rates.monthly),
      },
      images: uploadedImages,
    };

    await dbConnect();

    const addProperty = await Property.create(propertyData);

    if (!addProperty) {
      return NextResponse.json(
        { error: "Property not added" },
        { status: 400 },
      );
    }

    return NextResponse.json("success", { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to add property";

    return NextResponse.json({ error: message }, { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await dbConnect();
    const searchParams = req.nextUrl.searchParams;
    const featuredProperties = searchParams.get("featured-properties");
    const recentProperties = searchParams.get("recent-properties");

    if (featuredProperties) {
      const limitedProperties = await Property.find({})
        .lean()
        .limit(+featuredProperties);

      return NextResponse.json(limitedProperties, { status: 200 });
    } else if (recentProperties) {
      const limitedProperties = await Property.find({})
        .lean()
        .sort({ createdAt: -1 })
        .limit(+recentProperties);
      return NextResponse.json(limitedProperties, { status: 200 });
    }

    const allProperties = await Property.find({})
      .lean()
      .sort({ createdAt: -1 });

    return NextResponse.json(allProperties, { status: 200 });
  } catch (error) {
    return NextResponse.json(`There are an error ${error}`, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest) => {
  async function deleteImageFromCloudinary(publicId: string) {
    await cloudinary.uploader.destroy(publicId);
  }
  try {
    const searchParams = req.nextUrl.searchParams;
    const propertyId = searchParams.get("id");
    const session = await auth();
    const userId = session?.user?.id;

    if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
      return NextResponse.json("Invalid property id", { status: 400 });
    }

    if (!userId)
      return NextResponse.json("You are not authorized", { status: 401 });

    await dbConnect();
    const property = await Property.findById({ _id: propertyId }).lean();

    if (!property) {
      return NextResponse.json("Property not found", { status: 404 });
    }

    const property_owner = property.owner;
    const property_images = property.images;

    if (property_owner.toString() !== userId)
      return NextResponse.json("You are not authorized", { status: 401 });

    const deleteProperty = await Property.findByIdAndDelete({
      _id: propertyId,
    });

    if (!deleteProperty) {
      return NextResponse.json("Failed to delete", { status: 400 });
    }

    for (const image of property_images) {
      deleteImageFromCloudinary(image.public_id);
    }

    return NextResponse.json("success", { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete property";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    const session = await auth();
    const userId = session?.user?.id;
    const body = await req.json();

    if (!id || !userId || !body) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await dbConnect();
    const property = await Property.findById(id);

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 },
      );
    }

    if (property.owner.toString() !== userId) {
      return NextResponse.json(
        { error: "You are not authorized" },
        { status: 401 },
      );
    }

    const propertyData = { ...body };

    if (body.images && Array.isArray(body.images)) {
      const existingImages = body.images.filter(
        (img: any) => img && typeof img === "object" && img.url && img.public_id
      );
      const newBase64Images = body.images.filter(
        (img: any) => typeof img === "string" && img.startsWith("data:image/")
      );

      const originalImages = property.images || [];
      const existingPublicIds = new Set(
        existingImages.map((img: any) => img.public_id)
      );

      for (const img of originalImages) {
        if (img.public_id && !existingPublicIds.has(img.public_id)) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      const uploadedImages = [];
      for (const base64Image of newBase64Images) {
        const uploadResponse = await cloudinary.uploader.upload(base64Image, {
          folder: "rent_property/images",
        });
        uploadedImages.push({
          url: uploadResponse.secure_url,
          public_id: uploadResponse.public_id,
        });
      }

      propertyData.images = [...existingImages, ...uploadedImages];
    }

    if (propertyData.beds !== undefined) propertyData.beds = Number(propertyData.beds);
    if (propertyData.baths !== undefined) propertyData.baths = Number(propertyData.baths);
    if (propertyData.sqft !== undefined) propertyData.sqft = Number(propertyData.sqft);
    if (propertyData.rates) {
      propertyData.rates = {
        nightly: Number(propertyData.rates.nightly) || 0,
        weekly: Number(propertyData.rates.weekly) || 0,
        monthly: Number(propertyData.rates.monthly) || 0,
      };
    }

    const updateProperty = await Property.findByIdAndUpdate(
      id,
      { $set: propertyData },
      { new: true, runValidators: true },
    );

    if (!updateProperty) {
      return NextResponse.json({ error: "Failed to update" }, { status: 400 });
    }

    return NextResponse.json("success", { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
