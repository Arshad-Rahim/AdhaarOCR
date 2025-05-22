"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dataSchema = new mongoose_1.default.Schema({
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
exports.dataModel = mongoose_1.default.model("user", dataSchema);
