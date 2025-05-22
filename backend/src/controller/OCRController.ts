import { Request, Response } from "express";
import { extractAadhaarDetails } from "../service/OCRService";

export const extractAadhaar = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files.front || !files.back) {
       res.status(400).send("Both front and back images are required.");
       return;
    }

    const frontFile = files.front[0];
    const backFile = files.back[0];

    const details = await extractAadhaarDetails(frontFile.path, backFile.path);

    // Clean up uploaded files
    await Promise.all([
      new Promise((resolve) => require("fs").unlink(frontFile.path, resolve)),
      new Promise((resolve) => require("fs").unlink(backFile.path, resolve)),
    ]);

    if (
      details.aadhaarNumber === "Not found" &&
      details.name === "Not found" &&
      details.dob === "Not found" &&
      details.gender === "Not found" &&
      details.address === "Not found"
    ) {
       res.status(400).send("No valid Aadhaar details extracted.");
       return;
    }

    res.json(details);
  } catch (error: any) {
    // Clean up files on error
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files.front) require("fs").unlinkSync(files.front[0].path);
    if (files.back) require("fs").unlinkSync(files.back[0].path);

    console.error("Error:", error.message);
    res.status(500).send(`Error processing images: ${error.message}`);
  }
};
