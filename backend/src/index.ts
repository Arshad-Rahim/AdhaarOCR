import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";
import { extractAadhaar } from "./controller/OCRController";
import { connectDB } from "./config/connectDB";

dotenv.config();


connectDB();
const app = express();
const PORT = process.env.PORT || 3000;

// Debug environment variables
console.log("GOOGLE_CLOUD_PROJECT:", process.env.GOOGLE_CLOUD_PROJECT);
console.log("GOOGLE_CLIENT_EMAIL:", process.env.GOOGLE_CLIENT_EMAIL);
console.log(
  "GOOGLE_PRIVATE_KEY:",
  process.env.GOOGLE_PRIVATE_KEY ? "Set" : "Not set"
);

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

app.use(express.json());
app.use(cors());

app.post(
  "/extract-aadhaar",
  upload.fields([{ name: "front" }, { name: "back" }]),
  extractAadhaar
);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
