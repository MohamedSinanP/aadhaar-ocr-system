import React, { useState, useRef } from 'react';
import { Upload, FileText, Check, X, Camera, Sparkles } from 'lucide-react';
import ResultsPage from './ResultPage';
import Header from '../components/Header';
import Features from '../components/Features';
import type { DragOverState, ImageData, ImageSide, OCRResults } from '../types/type';
import { toast } from 'react-toastify';
import { getAadhaarDetails } from '../apis/aadharOcrApits';


const AadhaarOCRHomePage: React.FC = () => {
  const [frontImage, setFrontImage] = useState<ImageData | null>(null);
  const [backImage, setBackImage] = useState<ImageData | null>(null);
  const [dragOver, setDragOver] = useState<DragOverState>({ front: false, back: false });
  const [processing, setProcessing] = useState<boolean>(false);
  const [ocrResults, setOcrResults] = useState<OCRResults | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, side: ImageSide) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [side]: true }));
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, side: ImageSide) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [side]: false }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, side: ImageSide) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [side]: false }));

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0], side);
    }
  };

  const handleFileUpload = (file: File, side: ImageSide) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as string;
        if (side === 'front') {
          setFrontImage({ file, preview: result });
        } else {
          setBackImage({ file, preview: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, side: ImageSide) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, side);
    }
  };

  const removeImage = (side: ImageSide) => {
    if (side === 'front') {
      setFrontImage(null);
      if (frontInputRef.current) frontInputRef.current.value = '';
    } else {
      setBackImage(null);
      if (backInputRef.current) backInputRef.current.value = '';
    }
  };

  const processOCR = async () => {
    if (!frontImage || !backImage) {
      toast.error('Please upload both front and back images of the Aadhaar card');
      return;
    }

    setProcessing(true);

    try {
      const result = await getAadhaarDetails({
        img1: frontImage.file,
        img2: backImage.file,
      });
      console.log("data : ", result);

      const results: OCRResults = {
        name: result.name || '',
        dob: result.dob || '',
        gender: result.gender || '',
        aadhaarNumber: result.aadhaarNumber || '',
        address: result.address || '',
        pincode: result.pincode || '',
      };

      setOcrResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('OCR processing failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  const resetAll = () => {
    setFrontImage(null);
    setBackImage(null);
    setOcrResults(null);
    setShowResults(false);
    if (frontInputRef.current) frontInputRef.current.value = '';
    if (backInputRef.current) backInputRef.current.value = '';
  };

  // If results should be shown and we have results, render the ResultsPage component
  if (showResults && ocrResults) {
    return <ResultsPage ocrResults={ocrResults} onBackToHome={resetAll} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-blue-500 mr-3" />
            <h2 className="text-4xl font-bold text-gray-900">Aadhaar OCR System</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Extract information from Aadhaar cards instantly using advanced OCR technology.
            Simply upload both sides of your Aadhaar card and get structured data in seconds.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Front Side Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Camera className="w-5 h-5 mr-2 text-blue-500" />
                Front Side of Aadhaar
              </h3>
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${dragOver.front
                  ? 'border-blue-500 bg-blue-50'
                  : frontImage
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
                onDragOver={(e) => handleDragOver(e, 'front')}
                onDragLeave={(e) => handleDragLeave(e, 'front')}
                onDrop={(e) => handleDrop(e, 'front')}
              >
                {frontImage ? (
                  <div className="space-y-4">
                    <img
                      src={frontImage.preview}
                      alt="Front of Aadhaar"
                      className="max-h-48 mx-auto rounded-lg shadow-md"
                    />
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Front side uploaded</span>
                    </div>
                    <button
                      onClick={() => removeImage('front')}
                      className="inline-flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Drop front side image here
                      </p>
                      <p className="text-sm text-gray-500">or click to browse</p>
                    </div>
                    <button
                      onClick={() => frontInputRef.current?.click()}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </button>
                  </div>
                )}
                <input
                  ref={frontInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileInputChange(e, 'front')}
                  className="hidden"
                />
              </div>
            </div>

            {/* Back Side Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Camera className="w-5 h-5 mr-2 text-blue-500" />
                Back Side of Aadhaar
              </h3>
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${dragOver.back
                  ? 'border-blue-500 bg-blue-50'
                  : backImage
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
                onDragOver={(e) => handleDragOver(e, 'back')}
                onDragLeave={(e) => handleDragLeave(e, 'back')}
                onDrop={(e) => handleDrop(e, 'back')}
              >
                {backImage ? (
                  <div className="space-y-4">
                    <img
                      src={backImage.preview}
                      alt="Back of Aadhaar"
                      className="max-h-48 mx-auto rounded-lg shadow-md"
                    />
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Back side uploaded</span>
                    </div>
                    <button
                      onClick={() => removeImage('back')}
                      className="inline-flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Drop back side image here
                      </p>
                      <p className="text-sm text-gray-500">or click to browse</p>
                    </div>
                    <button
                      onClick={() => backInputRef.current?.click()}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </button>
                  </div>
                )}
                <input
                  ref={backInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileInputChange(e, 'back')}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Process Button */}
          <div className="text-center">
            <button
              onClick={processOCR}
              disabled={!frontImage || !backImage || processing}
              className={`inline-flex items-center px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300  ${frontImage && backImage && !processing
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-3" />
                  Extract Information
                </>
              )}
            </button>
          </div>
        </div>

        <Features />
      </main>
    </div>
  );
};

export default AadhaarOCRHomePage;