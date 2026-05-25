import { model, models, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      default: "customer",
      enum: ["customer", "admin"],
    },
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Property",
        default: [],
      },
    ],
  },
  { timestamps: true },
);

const User = models.User || model("User", UserSchema);
export default User;
