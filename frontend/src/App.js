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
    const stored = localStorage.getItem('darkMode');
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleShowUpload = () => setShowUpload(true);
  const handleHideUpload = () => setShowUpload(false);
  const handleUploadSuccessAndHide = (...args) => {
    handleUploadSuccess(...args);
    setShowUpload(false);
  };

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto flex h-screen max-w-5xl flex-col px-4 py-4 sm:px-6">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
          <Header
            pdfInfo={pdfInfo}
            hasDocument={Boolean(extractedText)}
            darkMode={darkMode}
            onToggleTheme={() => setDarkMode((dm) => !dm)}
            onUpload={handleShowUpload}
            onReset={handleReset}
          />

          <main className="flex min-h-0 flex-1 flex-col">
            <ChatInterface
              isLoadingText={isLoadingText}
              pdfInfo={pdfInfo}
              extractedText={extractedText}
              greeting={greeting}
              onUploadSuccess={handleUploadSuccess}
            />
          </main>
        </div>
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Upload resume</h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  PDF parsing stays in your browser.
                </p>
              </div>
              <button
                onClick={handleHideUpload}
                className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                aria-label="Close upload dialog"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <PdfUpload onUploadSuccess={handleUploadSuccessAndHide} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
