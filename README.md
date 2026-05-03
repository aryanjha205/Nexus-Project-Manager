# Building Role-Based Project Manager

Build a web app where users can create projects, assign tasks, and track progress with role-based access (Admin/Member).

**🌐 Live Demo:** [https://nexus-project-manager-lake.vercel.app/](https://nexus-project-manager-lake.vercel.app/)

## 🚀 Key Features
- Authentication (Signup/Login)
- Project & team management
- Task creation, assignment & status tracking
- Dashboard (tasks, status, overdue)

## ⚙️ Requirements
- REST APIs + Database (FastAPI + MongoDB)
- Proper validations & relationships
- Role-based access control (Admin/Member)
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


