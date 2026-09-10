# DevPulse — Developer Productivity Dashboard

> A modern, responsive developer productivity dashboard for tracking full-stack projects, sprint tasks, and delivery velocity. Built with Next.js 15, TypeScript, and Tailwind CSS.

## 🔗 Links

- **Live Demo:** https://akashhh8826.github.io/developer-productivity-dashboard/
- **GitHub Repo:** https://github.com/Akashhh8826/developer-productivity-dashboard

---

## ✨ Features

- **Dashboard** — Overview of total projects, tasks, completed/pending tasks, and upcoming deadlines with live progress charts
- **Projects Management** — View all ongoing projects, progress bars, tech stack tags, and detailed project modals
- **Task Tracker** — Filter tasks by status, priority, and project with interactive checkboxes
- **AI Productivity Insight** — Smart suggestions panel based on project activity
- **Theme Support** — Neo-brutalist UI with multiple color palette options (Sapphire Cyan, Rose, etc.)
- **Responsive Design** — Fully optimized for mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Hosting | GitHub Pages |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Akashhh8826/developer-productivity-dashboard.git
cd developer-productivity-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open your browser at the local server address shown in the terminal (usually `http://localhost:3000`).

---

## 📁 Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Dashboard page
│   ├── projects/         # Projects page
│   ├── tasks/            # Tasks page
│   └── settings/         # Settings page
├── components/           # Reusable UI components
│   ├── dashboard/        # Dashboard-specific components
│   ├── layout/           # Navbar, Sidebar, MobileNav
│   ├── projects/         # Project cards and modals
│   ├── tasks/            # Task list and rows
│   └── ui/               # Generic UI primitives
├── context/              # React context (DataContext)
├── lib/                  # Utilities and data services
├── data/                 # Mock JSON data
└── types/                # TypeScript type definitions
```

---

## 👤 Author

**Akash** — https://github.com/Akashhh8826
