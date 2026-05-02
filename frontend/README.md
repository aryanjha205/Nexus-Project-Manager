# Nexus - Project Manager PWA

Nexus is a modern, full-stack Progressive Web Application (PWA) designed for seamless project and task management. It combines a robust FastAPI backend with a dynamic React/Vite frontend.

## ✨ Features

- **Progressive Web App:** Fully installable and responsive across all devices.
- **FastAPI Backend:** High-performance, async backend architecture.
- **Authentication:** Secure JWT-based authentication with OTP email verification.
- **Dashboard Analytics:** Real-time metrics on your tasks (pending, completed, overdue).
- **Vercel Ready:** Pre-configured for immediate monorepo deployment on Vercel.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite, React Router, Lucide Icons
- **Backend:** FastAPI, MongoDB (Motor), Pydantic, Passlib, Uvicorn
- **Styling:** Custom CSS with sleek glassmorphism design and micro-animations

## 🚀 Getting Started

### Local Setup

**1. Start the Backend:**
```bash
cd backend
pip install -r requirements.txt
# Make sure to set your MongoDB URI and email credentials in your .env
uvicorn main:app --reload
```

**2. Start the Frontend:**
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`. The local Vite proxy will automatically forward API requests to the backend on port 8000.

### 🌐 Deployment on Vercel

This repository is optimized for Vercel. Simply import the repository in your Vercel dashboard. The included `vercel.json` will automatically:
- Build the React frontend as static assets.
- Deploy the FastAPI backend as Serverless Python Functions.
- Route API and frontend traffic appropriately without any manual configuration.

## 📄 License
MIT License
