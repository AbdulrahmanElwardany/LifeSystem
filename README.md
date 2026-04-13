# 🧠 Life System

> A personal operating system for tracking learning, goals, and bug bounty progress — built with vanilla HTML, CSS, and JavaScript.

[![Deploy Status](https://github.com/YOUR_USERNAME/life-system/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/life-system/actions)
[![GitHub Pages](https://img.shields.io/badge/Live-GitHub%20Pages-00ff88?style=flat&logo=github)](https://YOUR_USERNAME.github.io/life-system/pages/index.html)

---

## ✨ Features

| Page | Description |
|------|-------------|
| 🏠 **Dashboard** | Overview of all stats, streak ring, and quick navigation |
| 📊 **Overall Progress** | Track completion across Bug Bounty, Learning Bugs & Graduation roadmaps |
| 📅 **Daily Planner** | Log study sessions with elapsed time tracking |
| 🎯 **Goals Planner** | Daily, weekly, and monthly goal management |
| ✅ **Checklist** | Hub for reminders and IDOR writeups |
| 🔔 **Reminders** | Add, complete, and manage study reminders |
| 🐛 **IDOR Writeups** | Log and track bug writeup reports |
| 🗺️ **Bug Bounty Roadmap** | Visual learning roadmap for bug bounty hunting |
| 📚 **Learning Bugs** | Interactive roadmap for vulnerability research |
| ⚙️ **Automation Roadmap** | Track automation and tooling learning path |

---

## 🗂️ Project Structure

```
life-system/
│
├── .github/
│   └── workflows/
│       └── deploy.yml        # Auto-deploy to GitHub Pages on push
│
├── src/                      # Source code
│   ├── css/
│   │   ├── base.css          # CSS variables, reset, typography, animations
│   │   ├── layout.css        # Background, topbar, footer
│   │   └── components.css    # Cards, rings, arcs, quote banner
│   │
│   ├── js/
│   │   ├── data.js           # Static data: quotes, GRAD_LESSONS, constants
│   │   ├── storage.js        # Centralized localStorage helpers
│   │   └── ui.js             # DOM utilities: arcs, bars, counters
│   │
│   └── pages/
│       ├── index.html        # Dashboard (entry point)
│       ├── goals.html
│       ├── day-planner.html
│       ├── reminder.html
│       ├── checklist.html
│       ├── overall-progress.html
│       ├── bug-bounty-roadmap.html
│       ├── learning-bugs.html
│       ├── idor-writeups.html
│       └── automation-roadmap.html
│
├── docs/                     # Built output (served by GitHub Pages)
│
├── .gitignore
├── CHANGELOG.md
└── README.md
```

---

## 🚀 Getting Started

### Run locally

No build step needed. Just open in your browser:

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/life-system.git
cd life-system

# Open dashboard
open src/pages/index.html
```

### Deploy to GitHub Pages

1. Push to `main` branch
2. GitHub Actions automatically builds and deploys
3. Access your live site at:
   ```
   https://YOUR_USERNAME.github.io/life-system/pages/index.html
   ```

---

## 🛠️ Tech Stack

- **HTML5** — semantic structure
- **CSS3** — custom properties, grid, animations (no framework)
- **Vanilla JS** — modular ES5-compatible scripts
- **localStorage** — client-side data persistence (no backend)
- **GitHub Actions** — CI/CD pipeline
- **GitHub Pages** — free hosting

---

## 📦 Data Storage

All data is stored locally in your browser via `localStorage`. No server, no database, no account needed. Data is private to your device.

| Key | Contents |
|-----|----------|
| `day-YYYY-MM-DD` | Daily planner sessions |
| `goals-daily-YYYY-MM-DD` | Daily goals |
| `reminders` | Reminder items array |
| `idorWriteups` | Bug writeup entries |
| `bugBountyProgress` | Completed bug bounty lessons |
| `learningBugsProgress` | Completed learning bug lessons |
| `graduationProgress` | Graduation project lesson states |

---

## 📝 License

Personal project — not licensed for redistribution.
