import { useEffect, useState } from 'react';
import { parsePDF, generateGreeting } from '../utils/pdfParser';
import NehaDadarwalaPdf from '../resources/NehaDadarwalaResume.pdf';

export default function usePdfUpload() {
  const [extractedText, setExtractedText] = useState('');
  const [pdfInfo, setPdfInfo] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [isLoadingText, setIsLoadingText] = useState(true);

  const handleUploadSuccess = (pages, wordCount, text, info, greetingText) => {
    console.log(pages, wordCount, text, info, greetingText);
    setExtractedText(text);
    setPdfInfo({
      pages: pages,
      info: info
    });
    setGreeting(greetingText);
  };

  const handleReset = () => {
    setExtractedText('');
    setPdfInfo(null);
    setGreeting('');
  };

  useEffect(() => {
    const loadDefaultPdf = async () => {
      try {
        const response = await fetch(NehaDadarwalaPdf);
        const blob = await response.blob();
        const file = new File([blob], 'resume.pdf', { type: 'application/pdf' });
        const result = await parsePDF(file);
        handleUploadSuccess(
          result.pages,
          result.wordCount,
          result.text,
          result.info,
          generateGreeting(result.text)
        );
      } catch (error) {
        console.error('Failed to load default PDF:', error);
      } finally {
        setIsLoadingText(false);
      }
    };

    loadDefaultPdf();
  }, []);

  return {
    extractedText,
    pdfInfo,
    isLoadingText,
    greeting,
    handleUploadSuccess,
    handleReset,
  };
} 