# ⚙️ GenEd Studio — Setup Guide

Welcome to **GenEd Studio**, a platform where you can select a teaching persona and generate elegant, narrative-driven educational content — complete with synchronized transcripts and rich visual storytelling.

---

## 🔗 Repository

Clone the project from GitHub:

```bash
git clone https://github.com/mahirabidi12/GenEd-Studio.git
cd GenEd-Studio
```

---

## 🖥️ Terminal Setup (Split into 3 Tabs or Panes)

Open your terminal and split it into three parts:

1. **Tab 1:** Root folder (optional — for Git or global tools)
2. **Tab 2:** Navigate to backend:
   ```bash
   cd backend
   ```
3. **Tab 3:** Navigate to frontend:
   ```bash
   cd frontend
   ```

---

## 📁 Step 1: Set Up Environment Variables

Create your `.env` files manually in the following locations:

- `backend/.env`
- `frontend/.env`

Fill them using the placeholder values from their respective `.env.example` files in each folder.

> ⚠️ Do **not** commit your `.env` files to GitHub.

---

## 📦 Step 2: Install Dependencies

### In Backend Terminal

```bash
npm install
```

### In Frontend Terminal

```bash
npm install
```

---

## 🚀 Step 3: Run the Project

### In Backend Terminal

```bash
nodemon server.js
```

> If `nodemon` is not installed globally:
```bash
npm install -g nodemon
```

---

### In Frontend Terminal

```bash
npm run dev
```

---

## 🌐 Step 4: Access the Platform

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:3000](http://localhost:3000)

---

## ✅ You're All Set!

Now you can explore **GenEd Studio** — transform your voice and knowledge into personalized educational content powered by cutting-edge AI.

If you face any issues, feel free to open an issue in the repository or reach out to the maintainer.

---

**Happy Building! 🚀**