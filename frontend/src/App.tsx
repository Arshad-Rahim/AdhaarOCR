"use client";

import { useState } from "react";
import {
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Upload,
  ImageIcon,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function App() {
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [result, setResult] = useState<null | {
    success: boolean;
    message: string;
    data?: {
      name?: string;
      dob?: string;
      gender?: string;
      aadhaarNumber?: string;
      address?: string;
    };
  }>(null);

  const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/heif",
    "image/heic",
  ];

  const handleFrontImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!validImageTypes.includes(file.type)) {
        setResult({
          success: false,
          message:
            "Invalid file type. Please upload an image (JPG, PNG, HEIF).",
        });
        event.target.value = "";
        return;
      }
      setFrontFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setFrontImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBackImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!validImageTypes.includes(file.type)) {
        setResult({
          success: false,
          message:
            "Invalid file type. Please upload an image (JPG, PNG, HEIF).",
        });
        event.target.value = "";
        return;
      }
      setBackFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setBackImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleOCRProcess = async () => {
    if (!frontFile || !backFile) {
      setResult({
        success: false,
        message: "Please upload both front and back images before processing.",
      });
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);

    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
        }
        return newProgress;
      });
    }, 300);

    try {
      // Send both images in a single request
      const formData = new FormData();
      formData.append("front", frontFile);
      formData.append("back", backFile);

      const response = await fetch("http://localhost:3000/extract-aadhaar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Image processing failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Validate response
      if (
        data.aadhaarNumber === "Not found" &&
        data.name === "Not found" &&
        data.dob === "Not found" &&
        data.gender === "Not found" &&
        data.address === "Not found"
      ) {
        throw new Error("No valid Aadhaar details extracted from images.");
      }

      setTimeout(() => {
        setIsProcessing(false);
        setResult({
          success: true,
          message: "OCR processing completed successfully",
          data,
        });
      }, 500);
    } catch (error: any) {
      clearInterval(interval);
      setIsProcessing(false);
      setResult({
        success: false,
        message: `Error processing images: ${error.message}`,
      });
    }
  };

  const resetForm = () => {
    setFrontImage(null);
    setBackImage(null);
    setFrontFile(null);
    setBackFile(null);
    setResult(null);
    setIsProcessing(false);
    setProcessingProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Aadhaar Card OCR
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Upload front and back sides of your Aadhaar card for automatic
            information extraction
          </p>
        </div>

        {result && (
          <Alert
            className={`mb-6 ${
              result.success
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-start">
              {result.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
              )}
              <div>
                <AlertTitle
                  className={result.success ? "text-green-800" : "text-red-800"}
                >
                  {result.success ? "Success" : "Error"}
                </AlertTitle>
                <AlertDescription
                  className={result.success ? "text-green-700" : "text-red-700"}
                >
                  {result.message}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        <Card className="shadow-lg border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle>Document Upload</CardTitle>
            <CardDescription>
              Please upload clear images of both sides of your Aadhaar card
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="upload">Upload Images</TabsTrigger>
                <TabsTrigger value="results" disabled={!result?.success}>
                  Extracted Information
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-slate-700 flex items-center">
                      <ImageIcon className="w-5 h-5 mr-2 text-blue-500" /> Front
                      Side
                    </h3>
                    <div
                      className={`border rounded-lg p-4 ${
                        frontImage ? "border-green-300" : "border-gray-300"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFrontImageUpload}
                        className="file-input hidden"
                        id="front-image-upload"
                      />
                      {frontImage ? (
                        <div className="w-full">
                          <div className="flex items-center justify-between text-sm text-slate-600 mb-2 px-2">
                            <span className="flex items-center">
                              <FileCheck className="w-4 h-4 mr-1 text-green-500" />{" "}
                              Image uploaded
                            </span>
                          </div>
                          <div className="relative">
                            <img
                              src={frontImage}
                              alt="Aadhaar Front"
                              className="w-full h-auto rounded-lg shadow"
                            />
                            <div className="absolute top-2 right-2">
                              <span className="px-2 py-1 bg-blue-500/80 backdrop-blur-sm text-white text-xs rounded-md shadow">
                                Front
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor="front-image-upload"
                          className="cursor-pointer"
                        >
                          <div className="text-center p-4">
                            <Upload className="w-10 h-10 text-gray-400 mb-2 mx-auto" />
                            <p className="text-sm font-medium text-slate-700">
                              Click or drag to upload
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Supports: JPG, PNG, HEIF
                            </p>
                          </div>
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-slate-700 flex items-center">
                      <ImageIcon className="w-5 h-5 mr-2 text-blue-500" /> Back
                      Side
                    </h3>
                    <div
                      className={`border rounded-lg p-4 ${
                        backImage ? "border-green-300" : "border-gray-300"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBackImageUpload}
                        className="file-input hidden"
                        id="back-image-upload"
                      />
                      {backImage ? (
                        <div className="w-full">
                          <div className="flex items-center justify-between text-sm text-slate-600 mb-2 px-2">
                            <span className="flex items-center">
                              <FileCheck className="w-4 h-4 mr-1 text-green-500" />{" "}
                              Image uploaded
                            </span>
                          </div>
                          <div className="relative">
                            <img
                              src={backImage}
                              alt="Aadhaar Back"
                              className="w-full h-auto rounded-lg shadow"
                            />
                            <div className="absolute top-2 right-2">
                              <span className="px-2 py-1 bg-blue-500/80 backdrop-blur-sm text-white text-xs rounded-md shadow">
                                Back
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor="back-image-upload"
                          className="cursor-pointer"
                        >
                          <div className="text-center p-4">
                            <Upload className="w-10 h-10 text-gray-400 mb-2 mx-auto" />
                            <p className="text-sm font-medium text-slate-700">
                              Click or drag to upload
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Supports: JPG, PNG, HEIF
                            </p>
                          </div>
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {isProcessing && (
                  <div className="mt-8 space-y-3">
                    <div className="flex justify-between text-sm text-slate-600 mb-1">
                      <span>Processing OCR</span>
                      <span>{processingProgress}%</span>
                    </div>
                    <Progress value={processingProgress} className="h-2" />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="results">
                {result?.success && result.data && (
                  <div className="bg-slate-50 rounded-lg p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div className="space-y-1">
                        <p className="text-sm text-slate-500">Name</p>
                        <p className="font-medium">{result.data.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-slate-500">Date of Birth</p>
                        <p className="font-medium">{result.data.dob}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-slate-500">Gender</p>
                        <p className="font-medium">{result.data.gender}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-slate-500">Aadhaar Number</p>
                        <p className="font-medium">
                          {result.data.aadhaarNumber}
                        </p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <p className="text-sm text-slate-500">Address</p>
                        <p className="font-medium">{result.data.address}</p>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handleOCRProcess}
              disabled={!frontImage || !backImage || isProcessing}
              className="w-full sm:w-auto"
            >
              {isProcessing ? "Processing..." : "Process OCR"}
              {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>

            <Button
              variant="outline"
              onClick={resetForm}
              className="w-full sm:w-auto"
            >
              Reset
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center text-sm text-slate-500">
          <p>
            Your data is processed securely. We do not store your Aadhaar card
            images.
          </p>
        </div>
      </div>
    </div>
  );
}
