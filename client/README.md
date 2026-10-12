# 📄 Paper Tracker

A full-stack app to save, organize, and understand research papers, with AI-generated summaries.

🔗 **Live demo:** https://paper-tracker-xyz.vercel.app
(Backend is on a free tier, so the first request may take ~30-60 seconds to wake up.)

## Features
- JWT authentication (register/login, protected routes)
- Add papers by arXiv ID or link, with title, authors, and abstract auto-filled
- AI summaries using Gemini, cached in MongoDB (repeat loads: ~4.6s → ~0.09s)
- Retry with backoff and model fallback when the AI API is busy
- Search across title, authors, abstract, notes, and tags (debounced)
- Tag and reading-status filters
- Per-user data isolation (users can only access their own papers)

## Tech Stack
**Frontend:** React, Vite, React Router, Tailwind CSS, Axios
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
**AI:** Google Gemini API
**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas

## Screenshots
<!-- Dashboard, Add Paper aur Paper Detail ke screenshots yahan -->

## Run Locally
1. Clone the repo
2. `server/`: copy `.env.example` to `.env` and fill values, then `npm install && npm run dev`
3. `client/`: copy `.env.example` to `.env`, then `npm install && npm run dev`
4. Open http://localhost:5173