import React, { useRef, useState } from 'react';
import { parsePDF, generateGreeting } from '../utils/pdfParser';

export default function PdfUpload({ onUploadSuccess }) {
  const inputRef = useRef();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const validatePdfFile = (file) => {
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
      setUploadStatus('PDF parsed successfully.');
      if (onUploadSuccess) {
        onUploadSuccess(result.pages, result.wordCount, result.text, result.info, generateGreeting(result.text));
      }
    } catch (error) {
      console.error('Error parsing PDF:', error);
      setUploadStatus(`Error: ${error.message}`);
      alert(`Failed to parse PDF: ${error.message}`);
    } finally {
      setIsUploading(false);
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
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
      className={`flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-8 text-center transition ${
        isUploading
          ? 'cursor-not-allowed border-zinc-300 bg-zinc-50 opacity-70 dark:border-zinc-700 dark:bg-zinc-800/50'
          : isDragging
            ? 'border-zinc-900 bg-zinc-50 dark:border-zinc-200 dark:bg-zinc-800/70'
            : 'border-zinc-300 bg-zinc-50/70 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950/40 dark:hover:border-zinc-500'
      }`}
      onClick={() => !isUploading && inputRef.current.click()}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
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
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{uploadStatus}</p>
        </div>
      ) : (
        <>
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V8m0 0 3.25 3.25M12 8 8.75 11.25M5.75 16.75v1.5A1.75 1.75 0 0 0 7.5 20h9a1.75 1.75 0 0 0 1.75-1.75v-1.5" />
            </svg>
          </div>
          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">Drop a PDF here</p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            or <span className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 dark:text-zinc-100">browse files</span>
          </p>
          {uploadStatus && (
            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">{uploadStatus}</p>
          )}
        </>
      )}
    </div>
  );
}
