import { Schema, model } from "mongoose";

const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;

const StatsSchema = new Schema({
  totalDraws: {
    type: Number,
    default: 0,
  },
  totalSpentCents: {
    type: Number,
    default: 0,
  },
  totalWonCents: {
    type: Number,
    default: 0,
  },
});

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
  stats: {
    type: StatsSchema,
    default: () => ({}),
  },
});

export default model("User", UserSchema);
