import React, { useState } from 'react';
import { Check, ArrowLeft, Copy, Upload } from 'lucide-react';
import Header from '../components/Header';
import type { ResultsPageProps } from '../types/type';


const ResultsPage: React.FC<ResultsPageProps> = ({ ocrResults, onBackToHome }) => {
  const [copySuccess, setCopySuccess] = useState<string>('');

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
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Upload
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <Check className="w-8 h-8 text-green-500 mr-3" />
              Extracted Information
            </h2>
            <div className="flex space-x-3">
              <button
                onClick={onBackToHome}
                className="inline-flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-1" />
                Process New Card
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
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
            </div>

            <div className="space-y-4">
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
                <label className="block text-sm font-semibold text-gray-600 mb-1">Mobile</label>
                <p className="text-lg text-gray-900 pr-8">{ocrResults.pincode}</p>
                <button
                  onClick={() => copyToClipboard(ocrResults.pincode, 'mobile')}
                  className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="w-4 h-4" />
                </button>
                {copySuccess === 'mobile' && (
                  <span className="absolute top-4 right-12 text-xs text-green-600">Copied!</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;