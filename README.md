# 📄 Resume PDF AI Chatbot

This project allows users to upload a PDF file (like a resume), automatically extract its content, and interact with an AI chatbot to ask questions about it.

Built with:
- React (Frontend)
- Node.js + Express (Backend)
- pdf.js for parsing PDFs
- Cohere/OpenAI SDK (optional, for chat)

---

## 🗂️ Project Structure

project-root/
├── backend/        # Node.js server
├── frontend/       # React frontend
└── README.md

---

## ⚙️ Prerequisites

- Node.js (v16+ recommended)
- npm or yarn installed globally
- Optional: Cohere or OpenAI API Key for AI chat

---

## 🚀 Getting Started

### 1. Clone the repository

git clone https://github.com/NehaDadarwala/ResumeAIBot
cd ai-resume-chat

---

### 2. Add Environment Variables

#### Backend (backend/.env)
COHERE_API_KEY=your_cohere_api_key

#### Frontend (frontend/.env)
REACT_APP_API_URL=http://localhost:5000

---

### 3. Start the Backend

cd backend
npm install
npm run dev

# The backend will run on http://localhost:5000

---

### 4. Start the Frontend

cd ../frontend
npm install
npm run dev

# The frontend will run on http://localhost:3000

---

## 🧪 How to Use

1. Start both frontend and backend servers.
2. Open http://localhost:3000 in your browser.
3. Upload a PDF (or use the auto-loaded sample resume on first visit).
4. Interact with the chatbot to ask questions about your PDF content.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.