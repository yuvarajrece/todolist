# Todo App — MERN Stack

A simple Todo application with user authentication built with MongoDB, Express, React, and Node.js.

## 📁 Project Structure

```
todo-app/
├── client/         # React Frontend (Vite)
├── server/         # Express Backend
├── .env            # Environment variables
└── package.json    # Root package.json
```

## ⚙️ Setup Instructions

### 1. MongoDB Atlas Setup
1. Go to https://www.mongodb.com/atlas
2. Create a free account and cluster
3. Get your connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/tododb`)

### 2. Configure Environment Variables
Open the `.env` file and update:
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_random_secret_string
PORT=5000
```

### 3. Install All Dependencies
```bash
npm run install-all
```

### 4. Run the App (Development)
```bash
npm run dev
```
- Backend runs on: http://localhost:5000
- Frontend runs on: http://localhost:5173

## 🚀 Deployment

### Backend → Render
1. Push code to GitHub
2. Go to https://render.com → New Web Service
3. Connect your repo
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables from `.env`

### Frontend → Vercel
1. Go to https://vercel.com → New Project
2. Connect your GitHub repo
3. Set root directory to `client`
4. Deploy!

## ✅ Features
- User Registration
- User Login (JWT Auth)
- Add Tasks
- Edit Tasks
- Delete Tasks
- Mark Tasks as Complete
- Each user sees only their own tasks
