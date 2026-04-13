<div align="center">

```
██╗     ██╗███████╗███████╗    ███████╗██╗   ██╗███████╗████████╗███████╗███╗   ███╗
██║     ██║██╔════╝██╔════╝    ██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║
██║     ██║█████╗  █████╗      ███████╗ ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║
██║     ██║██╔══╝  ██╔══╝      ╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║
███████╗██║██║     ███████╗    ███████║   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║
╚══════╝╚═╝╚═╝     ╚══════╝    ╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝
```

**A personal operating system for tracking learning, goals, and bug bounty research.**

[![Deploy](https://github.com/AbdulrahmanElwardany/LifeSystem/actions/workflows/deploy.yml/badge.svg)](https://github.com/AbdulrahmanElwardany/LifeSystem/actions/workflows/deploy.yml)
[![Live](https://img.shields.io/badge/🌐%20Live%20Demo-00ff88?style=for-the-badge)](https://abdulrahmanelwardany.github.io/LifeSystem/pages/index.html)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## What is Life System?

Life System is a **zero-dependency, browser-based personal dashboard** built entirely with vanilla HTML, CSS, and JavaScript. No frameworks. No build tools. No backend. Every piece of data lives in your browser's `localStorage` — private, offline-first, instant.

It was built to solve one problem: having a single place to track learning progress, plan daily goals, manage reminders, and log bug bounty research — all in one cohesive system.

---

## Screenshots

> Dashboard · Goals · Progress · Roadmaps

| Dashboard | Overall Progress |
|-----------|-----------------|
| ![Dashboard](https://abdulrahmanelwardany.github.io/LifeSystem/pages/index.html) | Track your learning journey |

---

## Features

| Module | Description |
|--------|-------------|
| 🏠 **Dashboard** | Central hub with study streak ring, quick stats, and live navigation cards |
| 📊 **Overall Progress** | Real-time completion tracking across Bug Bounty, Learning Bugs & Graduation tracks |
| 📅 **Daily Planner** | Session timer with elapsed time, category tagging, and daily history |
| 🎯 **Goals Planner** | Daily, weekly, and monthly goals with completion rates and streaks |
| ✅ **Checklist** | Hub linking to Reminders and IDOR Writeups with live progress counters |
| 🔔 **Reminders** | Add, complete, link, and manage study reminders |
| 🐛 **IDOR Writeups** | Bug report logger with status tracking and external links |
| 🗺️ **Bug Bounty Roadmap** | Interactive visual roadmap for bug bounty learning |
| 📚 **Learning Bugs** | Vulnerability research roadmap with progress tracking |
| ⚙️ **Automation Roadmap** | Tooling and scripting learning path |

---

## Project Structure

```
LifeSystem/
│
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD — auto deploy src/ on push to main
│
├── src/                        # Single source of truth
│   │
│   ├── css/
│   │   ├── base.css            # Design tokens, CSS variables, reset
│   │   ├── layout.css          # Background effects, topbar, footer
│   │   ├── components.css      # Shared UI components (dashboard)
│   │   └── pages/
│   │       ├── goals.css
│   │       ├── day-planner.css
│   │       ├── checklist.css
│   │       ├── reminder.css
│   │       ├── overall-progress.css
│   │       ├── idor-writeups.css
│   │       ├── bug-bounty-roadmap.css
│   │       ├── learning-bugs.css
│   │       └── automation-roadmap.css
│   │
│   ├── js/
│   │   ├── data.js             # Static data: quotes, lesson constants
│   │   ├── storage.js          # Centralized localStorage API
│   │   ├── ui.js               # DOM utilities: arcs, bars, counters
│   │   └── pages/
│   │       ├── dashboard.js
│   │       ├── goals.js
│   │       ├── day-planner.js
│   │       ├── checklist.js
│   │       ├── reminder.js
│   │       ├── overall-progress.js
│   │       ├── idor-writeups.js
│   │       ├── bug-bounty-roadmap.js
│   │       ├── learning-bugs.js
│   │       └── automation-roadmap.js
│   │
│   └── pages/                  # Pure HTML — zero inline style or script
│       ├── index.html
│       ├── goals.html
│       ├── day-planner.html
│       ├── checklist.html
│       ├── reminder.html
│       ├── overall-progress.html
│       ├── idor-writeups.html
│       ├── bug-bounty-roadmap.html
│       ├── learning-bugs.html
│       └── automation-roadmap.html
│
├── .gitignore
├── CHANGELOG.md
├── LICENSE
└── README.md
```

---

## Getting Started

### Run locally

No build step. No `npm install`. No config.

```bash
# 1. Clone the repo
git clone https://github.com/AbdulrahmanElwardany/LifeSystem.git

# 2. Open in browser
open LifeSystem/src/pages/index.html
```

Or just drag `src/pages/index.html` into any browser.

### Deploy your own

1. Fork this repo
2. Go to **Settings → Pages**
3. Set source to: Branch `main`, folder `/src`
4. Your site goes live at `https://<your-username>.github.io/LifeSystem/pages/index.html`

Every push to `main` auto-deploys via GitHub Actions.

---

## Architecture

### Separation of Concerns

Every page follows strict separation — HTML, CSS, and JS live in completely separate files:

```
goals.html   →  loads  →  css/pages/goals.css
                           js/pages/goals.js
                           js/storage.js      (shared)
                           js/ui.js           (shared)
```

### Data Layer

All state is managed through `storage.js` — a centralized `localStorage` API with typed helpers. No page reads from `localStorage` directly.

```javascript
// Example usage in any page
const goals = Storage.getTodayGoals();
const { done, total } = Storage.getOverallProgress(AppData.GRAD_LESSONS);
```

### localStorage Keys

| Key | Type | Description |
|-----|------|-------------|
| `day-YYYY-MM-DD` | `{ sessions[] }` | Daily planner sessions |
| `goals-daily-YYYY-MM-DD` | `Goal[]` | Daily goals |
| `reminders` | `Reminder[]` | All reminders |
| `idorWriteups` | `Writeup[]` | Bug writeup entries |
| `bugBountyProgress` | `string[]` | Completed lesson IDs |
| `learningBugsProgress` | `string[]` | Completed lesson IDs |
| `graduationProgress` | `{ [id]: 'done' \| 'start' }` | Lesson states |

---

## Stats

| Metric | Count |
|--------|-------|
| Pages | 10 |
| CSS files | 12 |
| JS files | 13 |
| Total lines of code | ~6,000 |
| Dependencies | 0 |
| Bundle size | 0 KB |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 — semantic, zero inline styles |
| Styling | CSS3 — custom properties, grid, animations |
| Logic | Vanilla JS — ES6, modular, no bundler |
| Storage | Web localStorage API |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |
| Fonts | JetBrains Mono + Outfit (Google Fonts) |

---

## Roadmap

- [ ] PWA support — install as desktop/mobile app
- [ ] Export data to JSON backup
- [ ] Dark/Light theme toggle
- [ ] Keyboard shortcuts
- [ ] Search across all pages

---

## Contributing

This is a personal project, but PRs and suggestions are welcome.

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "feat: add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

MIT © [Abdulrahman Elwardany](https://github.com/AbdulrahmanElwardany)

---

<div align="center">
  <sub>Built with focus. Shipped with GitHub Pages.</sub>
</div>
