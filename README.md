Aadhaar OCR Web App (MERN Stack)
This project is a MERN stack web application that performs Optical Character Recognition (OCR) on images of Aadhaar cards. Users can upload images of both the front and back sides of an Aadhaar card, which are processed by the backend OCR API. The extracted information (such as name, gender, DOB, Aadhaar number, and address) is then displayed on the frontend in a structured and clean UI. The app simplifies and secures the digitization of Aadhaar details.
🛠️ Tech Stack

Frontend: ReactJS (with Vite for fast development)
Backend: Node.js + Express.js
OCR Library: Tesseract.js
Database: MongoDB (optional, for storing extracted data)
Deployment: Frontend (Vercel, Netlify), Backend (Render, Heroku)

🚀 Features

Upload front and back images of Aadhaar card
Preview uploaded images on the same page
Trigger OCR processing with a button click
Display extracted information (name, DOB, gender, Aadhaar number, address) in a clean, structured format
Basic validation and error handling for file uploads
Secure inputs and content type validation

🧪 Environment Variables
Create .env files in both the frontend and backend directories with the following variables:
Frontend .env
VITE_SERVER_BASEURL=http://localhost:5000

Backend .env
FRONTEND_URI=http://localhost:3000
PORT=5000

Note: The file /src/services/vision-key.json is required for the OCR functionality if using a cloud-based OCR service (e.g., Google Cloud Vision API). For Tesseract.js, this file is not required.
🏃‍♂️ Getting Started
Prerequisites

Node.js (v16 or higher)
npm or yarn
Git
(Optional) MongoDB for data persistence
(Optional) Google Cloud Vision API key for enhanced OCR (if not using Tesseract.js)

1. Clone the Repository
git clone https://github.com/Arshad-Rahim/AdhaarOCR.git
cd aadhaar-ocr-app

2. Setup Backend
Navigate to the backend directory, install dependencies, and start the server:
cd backend
npm install
npm start

The backend will run on http://localhost:5000 by default.
3. Setup Frontend
Navigate to the frontend directory, install dependencies, and start the development server:
cd frontend
npm install
npm start

The frontend will run on http://localhost:3000 by default.
4. Using the App

Open the app in your browser at http://localhost:3000.
Upload front and back images of an Aadhaar card (JPG or PNG format).
Click the "Process OCR" button to extract details.
View the extracted information (name, DOB, gender, Aadhaar number, address) displayed on the same page.

📦 Deployment

Frontend: Deploy on Vercel or Netlify. Update the VITE_SERVER_BASEURL in the frontend .env file with the deployed backend URL.
Backend: Deploy on Render or Heroku. Update the FRONTEND_URI in the backend .env file with the deployed frontend URL.
Ensure environment variables are configured in the deployment platform's settings.
If using MongoDB, provide a connection string in the backend .env file (e.g., MONGO_URI).

📸 Sample UI References
Upload Page

Displays two file input fields for front and back Aadhaar card images.
Shows a preview of uploaded images.
Includes a "Process OCR" button to trigger extraction.

Extracted Info Display

Presents extracted details in a structured format (e.g., a table or card layout).
Fields include Name, Gender, Date of Birth, Aadhaar Number, and Address.

⚠️ Notes

File Types: Only accept image files (JPG, PNG).
Security: Validate file types and sanitize inputs to prevent malicious uploads.
OCR Accuracy: Tesseract.js accuracy depends on image quality. For better results, ensure images are clear and well-lit.
Privacy: Handle Aadhaar card data securely and comply with data protection regulations (e.g., mask sensitive digits if required).

📃 License
This project is for educational/demo purposes only and is licensed under the MIT License.
🛡️ Security Considerations

Implement CORS to restrict backend access to the frontend URI.
Use HTTPS for deployed applications to secure data transmission.
Avoid storing sensitive Aadhaar data unless necessary, and ensure compliance with local data protection laws.

📬 Contact
For issues or contributions, please open a GitHub issue or submit a pull request at https://github.com/Arshad-Rahim/AdhaarOCR.
