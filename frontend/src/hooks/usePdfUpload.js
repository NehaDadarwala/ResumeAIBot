import { useEffect, useState } from 'react';
import { parsePDF, generateGreeting } from '../utils/pdfParser';
import NehaDadarwalaPdf from '../resources/NehaDadarwalaResume.pdf';

export default function usePdfUpload() {
  const [extractedText, setExtractedText] = useState('');
  const [pdfInfo, setPdfInfo] = useState(null);
  const [greeting, setGreeting] = useState('');

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

  // 🚀 Default upload logic
  useEffect(() => {
    const loadDefaultPdf = async () => {

      try {
        const response = await fetch(NehaDadarwalaPdf);
        const blob = await response.blob();
        const file = new File([blob], 'resume.pdf', { type: 'application/pdf' });
        console.log('Blob type:', blob.type);
        console.log('Blob size:', blob.size);

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
      }
    };

    loadDefaultPdf();
  }, []);


  return {
    extractedText,
    pdfInfo,
    greeting,
    handleUploadSuccess,
    handleReset,
  };
} 