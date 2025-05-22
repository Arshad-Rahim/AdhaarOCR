"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAadhaar = void 0;
const OCRService_1 = require("../service/OCRService");
const extractAadhaar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        if (!files.front || !files.back) {
            res.status(400).send("Both front and back images are required.");
            return;
        }
        const frontFile = files.front[0];
        const backFile = files.back[0];
        const details = yield (0, OCRService_1.extractAadhaarDetails)(frontFile.path, backFile.path);
        // Clean up uploaded files
        yield Promise.all([
            new Promise((resolve) => require("fs").unlink(frontFile.path, resolve)),
            new Promise((resolve) => require("fs").unlink(backFile.path, resolve)),
        ]);
        if (details.aadhaarNumber === "Not found" &&
            details.name === "Not found" &&
            details.dob === "Not found" &&
            details.gender === "Not found" &&
            details.address === "Not found") {
            res.status(400).send("No valid Aadhaar details extracted.");
            return;
        }
        res.json(details);
    }
    catch (error) {
        // Clean up files on error
        const files = req.files;
        if (files.front)
            require("fs").unlinkSync(files.front[0].path);
        if (files.back)
            require("fs").unlinkSync(files.back[0].path);
        console.error("Error:", error.message);
        res.status(500).send(`Error processing images: ${error.message}`);
    }
});
exports.extractAadhaar = extractAadhaar;
