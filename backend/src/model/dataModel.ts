import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  aadhaarNumber: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  dob:{
    type:String,
    required:true,
  },
  gender:{
    type:String,
    required:true,
  },
  address:{
    type:String,
    required:true,
  }
});

export const dataModel = mongoose.model("aadhar-data", dataSchema);
