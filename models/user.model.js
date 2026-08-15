import { Schema, model } from "mongoose";

const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    maxLength: "16",
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [emailRegex, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: true,
  },
  tickets: {
    type: Array,
    required: true,
  }
});

export default model("User", UserSchema);
