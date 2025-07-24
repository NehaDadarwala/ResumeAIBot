import React from 'react';

export default function PdfInfo({ pdfInfo }) {
  if (!pdfInfo) return null;

  return (
    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
      <p className="text-sm text-blue-800 dark:text-blue-100">
        PDF loaded: {pdfInfo.pages} page(s) • 
        {pdfInfo.info?.Title && ` Title: ${pdfInfo.info.Title}`}
      </p>
    </div>
  );
} 