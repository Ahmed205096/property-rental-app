import { model, models, Schema } from "mongoose";

const PropertySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      city: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipcode: {
        type: String,
        required: true,
      },
    },
    beds: {
      type: Number,
      required: true,
    },
    baths: {
      type: Number,
      required: true,
    },
    sqft: {
      type: Number,
      required: true,
    },
    amenities: {
      type: [String],
      enum: [
        "Wifi",
        "Washer & Dryer",
        "Air Conditioning",
        "Free Parking",
        "Swimming Pool",
        "24/7 Security",
        "Gym/Fitness Center",
        "Hot Tub",
        "Full Kitchen",
      ],
    },

    rates: {
      nightly: {
        type: Number,
        default: 0,
      },
      weekly: {
        type: Number,
        default: 0,
      },
      monthly: {
        type: Number,
        default: 0,
      },
    },
    images: {
      type: [Object],
      required: true,
    },
  },
  { timestamps: true },
);

PropertySchema.index({
  title: "text",
  type: "text",
  description: "text",
  "location.city": "text",
  "location.street": "text",
  "location.state": "text",
});
const Property = models.Property || model("Property", PropertySchema);
export default Property;
