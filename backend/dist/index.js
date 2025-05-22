"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const OCRController_1 = require("./controller/OCRController");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Debug environment variables
console.log("GOOGLE_CLOUD_PROJECT:", process.env.GOOGLE_CLOUD_PROJECT);
console.log("GOOGLE_CLIENT_EMAIL:", process.env.GOOGLE_CLIENT_EMAIL);
console.log("GOOGLE_PRIVATE_KEY:", process.env.GOOGLE_PRIVATE_KEY ? "Set" : "Not set");
const uploadDir = path_1.default.join(__dirname, "../uploads");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir);
}
const storage = multer_1.default.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/extract-aadhaar", upload.fields([{ name: "front" }, { name: "back" }]), OCRController_1.extractAadhaar);
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
