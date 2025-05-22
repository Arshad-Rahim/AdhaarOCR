import vision from "@google-cloud/vision";
import dotenv from "dotenv";

dotenv.config();

const client = new vision.ImageAnnotatorClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
});

export const extractAadhaarDetails = async (
  frontPath: string,
  backPath: string
) => {
  // Perform text detection on both images
  const [frontResult] = await client.textDetection(frontPath);
  const [backResult] = await client.textDetection(backPath);

  // Initialize frontText and backText as strings
  const frontText =
    frontResult.textAnnotations &&
    frontResult.textAnnotations[0] &&
    frontResult.textAnnotations[0].description
      ? frontResult.textAnnotations[0].description
      : "";
  const backText =
    backResult.textAnnotations &&
    backResult.textAnnotations[0] &&
    backResult.textAnnotations[0].description
      ? backResult.textAnnotations[0].description
      : "";

  if (!frontText && !backText) {
    throw new Error("No text found in either image.");
  }

  // Log OCR output for debugging
  console.log("Front text:", frontText);
  console.log("Back text:", backText);

  // Combine text from both images
  const combinedText = `${frontText}\n${backText}`;

  // Extract details
  const aadhaarMatch = combinedText.match(
    /(\d{4})\s*[\n\s]*(\d{4})\s*[\n\s]*(\d{4})/
  );
  const aadhaarNumber = aadhaarMatch
    ? `${aadhaarMatch[1]} ${aadhaarMatch[2]} ${aadhaarMatch[3]}`
    : "Not found";

  // Name: Prioritize front text, clean newlines and labels
  const nameMatch =
    frontText.match(/(?:Name|Full Name)\s*[:|-]\s*([^\n]+)/i) ||
    frontText.match(/(?<=Government of India\n)([A-Z][a-zA-Z\s]+)(?=\n|$)/) ||
    frontText.match(/^[A-Z][a-zA-Z\s]{2,}(?=\n|$)/m);
  let name = nameMatch ? (nameMatch[1] || nameMatch[0]).trim() : "Not found";
  name =
    name
      .replace(/\s*(DOB|Date of Birth|Gender|Male|Female|Other).*/i, "")
      .trim() || "Not found";

  // DOB: Prioritize front text, match "DOB:", "Year of Birth", or date
  const dobMatch =
    frontText.match(/DOB\s*[:|-]\s*(\d{2}[/-]\d{2}[/-]\d{4})/i) ||
    frontText.match(/Year of Birth\s*[:|-]\s*(\d{4})/) ||
    frontText.match(/\b(\d{2}[/-]\d{2}[/-]\d{4})\b/);
  let dob = dobMatch ? dobMatch[1] || dobMatch[0] : "Not found";
  if (dob !== "Not found") {
    const year = parseInt(dob.split(/[-/]/)[2], 10);
    if (year > 2005 || year < 1900) {
      dob = "Not found";
    }
  }

  // Gender: Prioritize front text
  const genderMatch =
    frontText.match(/(?:Gender|Sex)\s*[:|-]\s*(Male|Female|Other)/i) ||
    frontText.match(/\b(Male|Female|Other|MALE|FEMALE|OTHER)\b/i);
  const gender = genderMatch ? genderMatch[1] : "Not found";

  // Address: Prioritize back text, ensure complete PIN code
  const excludePatterns = [
    aadhaarNumber.replace(/\s/g, ""),
    "help@uidai.gov.in",
    "www.uidai.gov.in",
    "\\d{4}\\s*\\d{4}\\s*\\d{4}",
    "\\d{4}",
    "Government of India",
    "Aadhaar",
  ];
  const addressMatch =
    backText.match(/Address\s*[:|-]\s*([\s\S]*?)(?:,\s*\d{6}\b|$)/i) ||
    backText.match(/([\s\S]*?)(?:,\s*\d{6}\b|$)/);
  let address = addressMatch
    ? addressMatch[1].replace(/\n/g, ", ").trim()
    : backText.replace(/\n/g, ", ").trim();

  const pinMatch = backText.match(/\b\d{6}\b/);
  const pinCode = pinMatch ? pinMatch[0] : "";
  if (pinCode) {
    address = address
      .replace(/\b\d{1,6}\b(?!.*\b\d{6}\b)/g, "")
      .replace(/,,+/g, ",")
      .trim();
    address = `${address}${address ? ", " : ""}${pinCode}`;
  }

  excludePatterns.forEach((pattern) => {
    if (pattern && pattern !== "Not found") {
      address = address
        .replace(new RegExp(pattern, "gi"), "")
        .replace(/,,+/g, ",")
        .trim();
    }
  });
  address =
    address
      .replace(/,\s*,/g, ",")
      .replace(/^,+|,+$/g, "")
      .trim() || "Not found";

  return { aadhaarNumber, name, dob, gender, address };
};
