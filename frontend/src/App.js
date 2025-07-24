import React, { useState, useEffect } from 'react';
import PdfUpload from './components/PdfUpload';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import usePdfUpload from './hooks/usePdfUpload';
import './App.css';

function App() {
  const {
    extractedText,
    pdfInfo,
    isLoadingText,
    greeting,
    handleUploadSuccess,
    handleReset,
  } = usePdfUpload();

  const [showUpload, setShowUpload] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Try to load dark mode preference from localStorage
    const stored = localStorage.getItem('darkMode');
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleShowUpload = () => setShowUpload(true);
  const handleHideUpload = () => setShowUpload(false);
  const handleUploadSuccessAndHide = (...args) => {
    handleUploadSuccess(...args);
    setShowUpload(false);
  };

  return (
    <div className={`App min-h-screen flex flex-col items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <Header />
          <div className="flex gap-2 items-center">
            <button
              onClick={handleShowUpload}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800 transition font-semibold shadow-sm border border-gray-400 dark:border-gray-600"
            >
              Upload New PDF
            </button>
            {extractedText && (
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition font-semibold shadow-sm border border-red-400 dark:border-red-500"
              >
                Clear PDF
              </button>
            )}
            <button
              onClick={() => setDarkMode(dm => !dm)}
              className={`px-4 py-2 rounded transition font-semibold border ${darkMode ? 'bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700' : 'bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300'}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </div>
        {showUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 relative w-full max-w-md">
              <button onClick={handleHideUpload} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white text-2xl">&times;</button>
              <PdfUpload onUploadSuccess={handleUploadSuccessAndHide} />
            </div>
          </div>
        )}
        <ChatInterface 
          isLoadingText={isLoadingText}
          pdfInfo={pdfInfo}
          extractedText={extractedText}
          greeting={greeting}
        />
      </div>
    </div>
  );
}

export default App;
