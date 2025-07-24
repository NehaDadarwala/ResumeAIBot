import React from 'react';
import PdfInfo from './PdfInfo';
import LoadingSpinner from './LoadingSpinner';
import Chatbot from './Chatbot';

export default function ChatInterface({ isLoadingText, pdfInfo, extractedText, greeting }) {
  if (isLoadingText) {
    return <LoadingSpinner message="Parsing PDF..." />;
  }

  if (!extractedText) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Welcome to Resume Chatbot
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Upload a PDF resume to start asking questions about the candidate.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
            PDF parsing happens entirely in your browser - no data is sent to any server.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PdfInfo pdfInfo={pdfInfo} />
      <Chatbot resumeText={extractedText} greeting={greeting} />
    </>
  );
} 