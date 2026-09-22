import React from 'react';

export default function PdfInfo({ pdfInfo }) {
  if (!pdfInfo) return null;

  const title = pdfInfo.info?.Title;

  return (
    <div className="mb-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.75h6.5L17.25 7.5V20.25H7A1.25 1.25 0 0 1 5.75 19V5A1.25 1.25 0 0 1 7 3.75Z" />
        </svg>
      </span>
      <span>
        {pdfInfo.pages} page{pdfInfo.pages === 1 ? '' : 's'}
        {title ? ` · ${title}` : ''}
      </span>
    </div>
  );
}
