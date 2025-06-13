import React, { useState, useRef } from 'react';
import { Upload, FileText, Check, X, Camera, Sparkles, Copy, ArrowLeft } from 'lucide-react';
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
  const [copySuccess, setCopySuccess] = useState<string>('');

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
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as string;
        img.src = result;

        img.onload = () => {
          if (img.width < 500 || img.height < 500) {
            toast.warn(
              'The uploaded image may be low resolution. For best OCR results, use an image with at least 500x500 pixels.',
              { autoClose: 5000 }
            );
          }

          if (side === 'front') {
            setFrontImage({ file, preview: result });
          } else {
            setBackImage({ file, preview: result });
          }
        };
      };

      reader.readAsDataURL(file);
    } else {
      toast.error('Please upload a valid image file (PNG or JPEG).');
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

      const results: OCRResults = {
        name: result.name || '',
        dob: result.dob || '',
        gender: result.gender || '',
        aadhaarNumber: result.aadhaarNumber || '',
        address: result.address || '',
        pincode: result.pincode || '',
      };

      setOcrResults(results);
    } catch (error: any) {
      if (error.message) {
        console.error('Frontend OCR error:', error.message);
      } else {
        toast.error('An unexpected error occurred during OCR processing. Please try again.', { autoClose: 5000 });
      }
    } finally {
      setProcessing(false);
    }
  };

  const resetAll = () => {
    setFrontImage(null);
    setBackImage(null);
    setOcrResults(null);
    setCopySuccess('');
    if (frontInputRef.current) frontInputRef.current.value = '';
    if (backInputRef.current) backInputRef.current.value = '';
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(field);
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

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
            For best results, upload high-quality, well-lit images of both sides of your Aadhaar card.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Upload Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Upload Aadhaar Card</h3>

              <div className="space-y-6">
                {/* Front Side Upload */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Camera className="w-5 h-5 mr-2 text-blue-500" />
                    Front Side
                  </h4>
                  <div
                    className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${dragOver.front
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
                      <div className="space-y-3">
                        <img
                          src={frontImage.preview}
                          alt="Front of Aadhaar"
                          className="max-h-32 mx-auto rounded-lg shadow-md"
                        />
                        <div className="flex items-center justify-center space-x-2 text-green-600">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">Front uploaded</span>
                        </div>
                        <button
                          onClick={() => removeImage('front')}
                          className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Drop front side here</p>
                          <p className="text-xs text-gray-500">or click to browse</p>
                          <p className="text-xs text-blue-600 mt-1">Tip: Use a clear, well-lit image for best results.</p>
                        </div>
                        <button
                          onClick={() => frontInputRef.current?.click()}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
                        >
                          <Upload className="w-3 h-3 mr-2" />
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
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Camera className="w-5 h-5 mr-2 text-blue-500" />
                    Back Side
                  </h4>
                  <div
                    className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${dragOver.back
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
                      <div className="space-y-3">
                        <img
                          src={backImage.preview}
                          alt="Back of Aadhaar"
                          className="max-h-32 mx-auto rounded-lg shadow-md"
                        />
                        <div className="flex items-center justify-center space-x-2 text-green-600">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">Back uploaded</span>
                        </div>
                        <button
                          onClick={() => removeImage('back')}
                          className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Drop back side here</p>
                          <p className="text-xs text-gray-500">or click to browse</p>
                          <p className="text-xs text-blue-600 mt-1">Tip: Ensure the address is fully visible and legible.</p>
                        </div>
                        <button
                          onClick={() => backInputRef.current?.click()}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
                        >
                          <Upload className="w-3 h-3 mr-2" />
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

                {/* Process Button */}
                <div className="text-center pt-4">
                  <button
                    onClick={processOCR}
                    disabled={!frontImage || !backImage || processing}
                    className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${frontImage && backImage && !processing
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    {processing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Extract Information
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Results Section */}
          <div className="space-y-6">
            {ocrResults ? (
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Check className="w-6 h-6 text-green-500 mr-2" />
                    Extracted Information
                  </h3>
                  <button
                    onClick={resetAll}
                    className="inline-flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Reset
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl relative group">
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Name</label>
                    <p className="text-lg text-gray-900 pr-8">{ocrResults.name}</p>
                    <button
                      onClick={() => copyToClipboard(ocrResults.name, 'name')}
                      className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {copySuccess === 'name' && (
                      <span className="absolute top-4 right-12 text-xs text-green-600">Copied!</span>
                    )}
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl relative group">
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Date of Birth</label>
                    <p className="text-lg text-gray-900 pr-8">{ocrResults.dob}</p>
                    <button
                      onClick={() => copyToClipboard(ocrResults.dob, 'dob')}
                      className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {copySuccess === 'dob' && (
                      <span className="absolute top-4 right-12 text-xs text-green-600">Copied!</span>
                    )}
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl relative group">
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Gender</label>
                    <p className="text-lg text-gray-900 pr-8">{ocrResults.gender}</p>
                    <button
                      onClick={() => copyToClipboard(ocrResults.gender, 'gender')}
                      className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {copySuccess === 'gender' && (
                      <span className="absolute top-4 right-12 text-xs text-green-600">Copied!</span>
                    )}
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl relative group">
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Aadhaar Number</label>
                    <p className="text-lg text-gray-900 font-mono pr-8">{ocrResults.aadhaarNumber}</p>
                    <button
                      onClick={() => copyToClipboard(ocrResults.aadhaarNumber, 'aadhaar')}
                      className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {copySuccess === 'aadhaar' && (
                      <span className="absolute top-4 right-12 text-xs text-green-600">Copied!</span>
                    )}
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl relative group">
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Address</label>
                    <p className="text-gray-900 whitespace-pre-line pr-8">{ocrResults.address}</p>
                    <button
                      onClick={() => copyToClipboard(ocrResults.address, 'address')}
                      className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {copySuccess === 'address' && (
                      <span className="absolute top-4 right-12 text-xs text-green-600">Copied!</span>
                    )}
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl relative group">
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Pincode</label>
                    <p className="text-lg text-gray-900 pr-8">{ocrResults.pincode}</p>
                    <button
                      onClick={() => copyToClipboard(ocrResults.pincode, 'pincode')}
                      className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {copySuccess === 'pincode' && (
                      <span className="absolute top-4 right-12 text-xs text-green-600">Copied!</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">No Results Yet</h3>
                  <p className="text-gray-400">Upload both sides of your Aadhaar card and click "Extract Information" to see the results here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-12">
          <Features />
        </div>
      </main>
    </div>
  );
};

export default AadhaarOCRHomePage;