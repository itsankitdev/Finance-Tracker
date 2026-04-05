# 💸 Finance Tracker

A full-stack personal finance dashboard built with **React**, **Node.js**, **Express**, and **MongoDB**. Track your expenses, visualize spending patterns, and stay within budget — all with a beautiful glassmorphism UI.

🔗 **Live Demo:** [https://finance-tracker-expense.vercel.app/](https://finance-tracker-expense.vercel.app/)

---

## ✨ Features

- 🔐 **User Authentication** — Register & Login with JWT-based auth. Each user sees only their own data.
- ➕ **Add / Edit / Delete Expenses** — Full CRUD with category, title, amount and date.
- 📊 **Charts & Visualizations** — Pie chart for spending breakdown, line chart for daily trends.
- 💡 **Smart Insights** — Automatically detects top spending category and monthly trends.
- 🧠 **Smart Tips** — Rule-based tips that flag overspending patterns.
- 💰 **Budget Tracker** — Set a monthly budget with an animated progress bar (turns red when exceeded).
- 🔍 **Filter Expenses** — Filter by category and date.
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop.
- 🎨 **Glassmorphism UI** — Purple/violet frosted glass design with smooth Framer Motion animations.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React + Vite | UI framework & bundler |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations & transitions |
| Recharts | Charts & data visualization |
| Axios | API calls |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| dotenv | Environment variables |
| nodemon | Dev server auto-restart |

---

## 📁 Project Structure

```
Finance Tracker/
├── client/                  # React frontend
│   ├── src/
│   │   ├── api/
│   │   │   ├── authApi.js
│   │   │   └── expenseApi.js
│   │   ├── components/
│   │   │   ├── AuthModal.jsx
│   │   │   ├── CategoryChart.jsx
│   │   │   ├── DeleteModal.jsx
│   │   │   ├── EditModal.jsx
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── ExpenseList.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Insights.jsx
│   │   │   ├── MonthlyChart.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── SmartTips.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── backend/                  # Node.js backend
    ├── models/
    │   ├── Expense.js
    │   └── User.js
    ├── routes/
    │   ├── authRoutes.js
    │   └── expenseRoutes.js
    ├── middleware/
    │   └── auth.js
    ├── server.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/itsankitdev/finance-tracker.git
cd finance-tracker
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `server` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the backend:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`
Backend runs at: `http://localhost:5000`

---

## 🌐 Deployment

| Service | Platform |
|---|---|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |
| Database | [MongoDB Atlas](https://cloud.mongodb.com) |

### Deploy Frontend (Vercel)
1. Push code to GitHub
2. Import repo on Vercel
3. Set root directory to `client`
4. Deploy — auto-deploys on every push ✅

### Deploy Backend (Render)
1. Create a new **Web Service** on Render
2. Connect your GitHub repo
3. Set root directory to `server`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables: `MONGO_URI`, `JWT_SECRET`
7. Deploy ✅

> ⚠️ Render free tier spins down after 15 mins of inactivity. First request may take ~30 seconds to wake up.

---

## 📸 Screenshots

### Dashboard
![Dashboard](https://finance-tracker-expense.vercel.app/og-preview.png)

---

## 🔑 Environment Variables

### Backend `.env`

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/finance-tracker
JWT_SECRET=your_super_secret_key
PORT=5000
```

---

## 🙌 Author

**Ankit Kumar**
- GitHub: [@itsankitdev](https://github.com/itsankitdev)
- Portfolio: [portfolio-itsankitdev.vercel.app](https://portfolio-itsankitdev.vercel.app)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ If you found this project helpful, give it a star on GitHub!
