import React, { useRef, useState } from 'react';
import { parsePDF, generateGreeting } from '../utils/pdfParser';

export default function PdfUpload({ onUploadSuccess }) {
  const inputRef = useRef();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const validatePdfFile = (file) => {
    // Check if file is a PDF by MIME type and file extension
    const isValidPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isValidPdf) {
      alert('Please select a valid PDF file.');
      return false;
    }
    return true;
  };

  const parsePdfLocally = async (file) => {
    setIsUploading(true);
    setUploadStatus('Parsing PDF...');

    try {
      const result = await parsePDF(file);
      
      setUploadStatus('PDF parsed successfully!');
      
      // Call the callback with parsed data
      if (onUploadSuccess) {
        onUploadSuccess(result.pages, result.wordCount, result.text, result.info, generateGreeting(result.text));
      }
    } catch (error) {
      console.error('Error parsing PDF:', error);
      setUploadStatus(`Error: ${error.message}`);
      alert(`Failed to parse PDF: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validatePdfFile(file)) {
        parsePdfLocally(file);
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validatePdfFile(file)) {
        parsePdfLocally(file);
      }
    }
  };

  return (
    <div
      style={{
        border: '2px dashed #9ca3af',
        borderRadius: '8px',
        padding: '32px',
        textAlign: 'center',
        cursor: isUploading ? 'not-allowed' : 'pointer',
        backgroundColor: isUploading ? '#1f2937' : '#111827', // dark mode fallback
        minWidth: '300px',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: isUploading ? 0.7 : 1
      }}
      className={`border-2 border-dashed border-gray-400 rounded-lg p-8 text-center transition ${
        isUploading ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-800 opacity-70' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 dark:bg-gray-900'
      }`}
      onClick={() => !isUploading && inputRef.current.click()}
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
    >
      <input
        type="file"
        accept=".pdf,application/pdf"
        ref={inputRef}
        className="hidden"
        onChange={handleChange}
        disabled={isUploading}
      />
      
      {isUploading ? (
        <div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{uploadStatus}</p>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: '8px' }} className="mb-2 text-gray-600 dark:text-gray-300">
            Drag and drop a PDF file here, or <span className="text-blue-600 dark:text-blue-400 underline">browse</span>
          </p>
          {uploadStatus && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">{uploadStatus}</p>
          )}
        </>
      )}
    </div>
  );
} 