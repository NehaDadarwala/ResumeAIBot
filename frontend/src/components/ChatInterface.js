import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import Chatbot from './Chatbot';
import PdfUpload from './PdfUpload';

export default function ChatInterface({ isLoadingText, extractedText, greeting, onUploadSuccess }) {
  if (isLoadingText) {
    return <LoadingSpinner message="Preparing resume..." />;
  }

  if (!extractedText) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-lg">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Workspace</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Review a candidate in minutes</h2>
          <p className="mt-2 mb-6 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Drop in a resume PDF, then ask about experience, skills, tenure, or fit. Parsing happens locally.
          </p>
          <PdfUpload onUploadSuccess={onUploadSuccess} />
        </div>
      </div>
    );
  }

  return <Chatbot resumeText={extractedText} greeting={greeting} />;
}
