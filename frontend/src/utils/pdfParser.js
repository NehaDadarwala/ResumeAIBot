// PDF.js worker path - we'll use the CDN version
const PDFJS_WORKER_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Initialize PDF.js
const initPDFJS = () => {
  if (window.pdfjsLib) {
    // Set worker path
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC;
    return window.pdfjsLib;
  }
  
  // Wait for PDF.js to load
  return new Promise((resolve) => {
    const checkPDFJS = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC;
        resolve(window.pdfjsLib);
      } else {
        setTimeout(checkPDFJS, 100);
      }
    };
    checkPDFJS();
  });
};

export const parsePDF = async (file) => {
  try {
    const pdfjsLib = await initPDFJS();
    
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    const numPages = pdf.numPages;
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine text items
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
    }
    
    // Get document info
    const metadata = await pdf.getMetadata();
    const info = metadata?.info || {};
    
    return {
      text: fullText.trim(),
      pages: numPages,
      info: {
        Title: info.Title || file.name,
        Author: info.Author || '',
        Subject: info.Subject || '',
        Creator: info.Creator || '',
        CreationDate: info.CreationDate || '',
        ModDate: info.ModDate || ''
      },
      wordCount: fullText.trim().split(/\s+/).length
    };
    
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};

export const generateGreeting = (resumeText) => {
  // Simple greeting generation based on common resume patterns
  const lines = resumeText.split('\n').filter(line => line.trim());
  
  // Try to find name from common patterns
  let name = '';
  
  // Look for name in first few lines (common resume format)
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    // Simple pattern: if line has 2-3 words and no special characters, it might be a name
    if (line && line.split(' ').length <= 3 && !/[^\w\s]/.test(line)) {
      name = line;
      break;
    }
  }
  
  // If no name found, use a generic greeting
  if (!name) {
    name = 'the candidate';
  }
  
  return `Hello! I've analyzed ${name}'s resume. Feel free to ask me any questions about their background, skills, experience, or qualifications. I'm here to help you learn more about this candidate!`;
}; 