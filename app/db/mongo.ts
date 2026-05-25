import mongoose from "mongoose";

const mongo_uri = process.env.MONGO_URI;
mongoose.set("strictQuery", true);

if (!mongo_uri) {
  throw new Error("There are an error in the mongo uri");
}

const dbConnect = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return true;
    }

    await mongoose.connect(mongo_uri, { bufferCommands: false });
  } catch {
    return false;
  }
};

export default dbConnect;
