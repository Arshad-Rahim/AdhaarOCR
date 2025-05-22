import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  DOB: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  UID: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
});

export const dataModel = mongoose.model("user", dataSchema);
