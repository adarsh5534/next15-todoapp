import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Removes whitespace
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate emails
      lowercase: true, // Converts email to lowercase
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Enforce minimum password length
    },
    role: {
      type: String,
      default: "user", // Default role is 'user'
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
