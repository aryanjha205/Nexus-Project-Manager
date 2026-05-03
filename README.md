# Nexus - Project Manager PWA

Nexus is a modern, full-stack Progressive Web Application (PWA) designed for seamless project and task management. It combines a robust FastAPI backend with a dynamic React/Vite frontend.

See `frontend/README.md` for full documentation and setup instructions.

## Quick Start
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Environment Variables / Secrets
The following credentials are required to run the application (typically stored in `backend/.env`):

```env
SECRET_KEY="your-secret-key-super-secret"
EMAIL_USER="aryankjhaa@gmail.com"
EMAIL_PASS="gafo clsx axhr hnzv"
MONGO_URL="mongodb+srv://kushalshah3017_db_user:nEwYq7yjYFcwuDFM@cluster0.ocmbizk.mongodb.net/"
```
