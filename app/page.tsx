'use client';
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setResult('');
      
      // Create preview URL
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreview(fileUrl);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    } else {
      setResult('Error: No file selected');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('http://3.129.250.245:5000/predict', formData);
      setResult(res.data.prediction);
    } catch (error) {
      setResult('Error: ' + (error instanceof Error ? error.message : 'An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">උ or ඉ Classifier</h1>
        
        <div className="mb-5">
          <label className="inline-block px-6 py-3 bg-gray-200 text-gray-700 rounded-md cursor-pointer transition duration-300 hover:bg-gray-300">
            <span>Choose File</span>
            <input 
              type="file" 
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </label>
        </div>

        {preview && (
          <div className="my-5 rounded-lg overflow-hidden shadow-md">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-auto max-h-[220px] object-contain" 
            />
          </div>
        )}

        <button 
          className="bg-blue-500 text-white border-0 px-8 py-3 rounded-md text-base cursor-pointer transition duration-300 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handleUpload} 
          disabled={!file || loading}
        >
          {loading ? 'Processing...' : 'Predict'}
        </button>

        {result && (
          <div className={`mt-8 p-4 rounded-lg text-gray-700 ${
            result.includes('Error') 
              ? 'bg-red-50 border border-red-200' 
              : 'bg-green-50 border border-green-200'
          }`}>
            <h2 className="mt-0 text-lg font-semibold">Result:</h2>
            <p className="text-lg">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}