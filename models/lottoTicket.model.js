import { Schema, model } from "mongoose";

const LottoSelectionSchema = new Schema({
  numbers: {
    type: [Number],
    required: true,
    validate: {
      validator: function (v) {
        return (
          v.length === 6 &&
          v.every(
            (number) => Number.isInteger(number) && number >= 1 && number <= 49,
          ) &&
          new Set(v).size === v.length
        );
      },
      message: () => "Select 6 unique numbers between 1 and 49.",
    },
  },
});

const LottoTicketSchema = new Schema({
  name: {
    type: String,
    trim: true,
    maxLength: 16,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  selections: {
    type: [LottoSelectionSchema],
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 1 && v.length <= 12;
      },
      message: "A ticket must contain between 1 and 12 selections.",
    },
  },
  supernumber: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return Number.isInteger(v) && v >= 0 && v <= 9;
      },
      message: () => "Select a whole Superzahl between 0 and 9.",
    },
  },
  drawsPerWeek: {
    type: Number,
    required: true,
    enum: [1, 2],
  },
  durationWeeks: {
    type: Number,
    required: true,
    default: 1,
    validate: {
      validator: function (v) {
        return Number.isInteger(v) && v >= 1;
      },
      message: "A ticket must run at least one week.",
    },
  },
  date: { type: Date, default: Date.now },
});

export default model("LottoTicket", LottoTicketSchema);
