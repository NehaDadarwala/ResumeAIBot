import React from 'react';

export default function Header({ pdfInfo, hasDocument, darkMode, onToggleTheme, onUpload, onReset }) {
  return (
    <header className="flex flex-col gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.75h6.5L17.25 7.5V20.25H7A1.25 1.25 0 0 1 5.75 19V5A1.25 1.25 0 0 1 7 3.75Z" />
            <path strokeLinecap="round" d="M13.5 3.75V7.5h3.75M8.5 12h7M8.5 15.5h5" />
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight sm:text-base">Resume Analyst</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {hasDocument
              ? `${pdfInfo?.pages || 1} page${(pdfInfo?.pages || 1) === 1 ? '' : 's'}${pdfInfo?.info?.Title ? ` · ${pdfInfo.info.Title}` : ''}`
              : 'Ask questions about any PDF resume'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onUpload}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V8m0 0 3.25 3.25M12 8 8.75 11.25M5.75 16.75v1.5A1.75 1.75 0 0 0 7.5 20h9a1.75 1.75 0 0 0 1.75-1.75v-1.5" />
          </svg>
          {hasDocument ? 'Replace PDF' : 'Upload PDF'}
        </button>
        {hasDocument && (
          <button
            onClick={onReset}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Clear
          </button>
        )}
        <button
          onClick={onToggleTheme}
          className="rounded-lg border border-zinc-200 p-2 text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="4" />
              <path strokeLinecap="round" d="M12 3v1.5M12 19.5V21M4.93 4.93l1.06 1.06M18.01 18.01l1.06 1.06M3 12h1.5M19.5 12H21M4.93 19.07l1.06-1.06M18.01 5.99l1.06-1.06" />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 13.2A6.2 6.2 0 0 1 10.8 7.5 6.5 6.5 0 1 0 16.5 13.2Z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
