# Life System

**A personal operating system for tracking learning progress, daily goals, and bug bounty research.**

[![Deploy](https://github.com/AbdulrahmanElwardany/LifeSystem/actions/workflows/deploy.yml/badge.svg)](https://github.com/AbdulrahmanElwardany/LifeSystem/actions/workflows/deploy.yml)
[![Live](https://img.shields.io/badge/live-github%20pages-00ff88?style=flat-square&logo=github)](https://abdulrahmanelwardany.github.io/LifeSystem/pages/index.html)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

---

## Overview

Life System is a browser-based personal dashboard — no backend, no framework, no dependencies. All data is stored locally via `localStorage`.

**Live →** https://abdulrahmanelwardany.github.io/LifeSystem/pages/index.html

---

## Pages

| Page | Path | Description |
|------|------|-------------|
| Dashboard | `/pages/index.html` | Overview, streak ring, quick stats |
| Overall Progress | `/pages/overall-progress.html` | Course completion across 3 tracks |
| Daily Planner | `/pages/day-planner.html` | Session timer and study tracking |
| Goals Planner | `/pages/goals.html` | Daily, weekly, monthly goals |
| Checklist | `/pages/checklist.html` | Hub for reminders and writeups |
| Reminders | `/pages/reminder.html` | Task and deadline management |
| IDOR Writeups | `/pages/idor-writeups.html` | Bug report logger |
| Bug Bounty Roadmap | `/pages/bug-bounty-roadmap.html` | Learning path tracker |
| Learning Bugs | `/pages/learning-bugs.html` | Vulnerability research roadmap |
| Automation Roadmap | `/pages/automation-roadmap.html` | Tooling and scripting path |

---

## Project Structure

```
LifeSystem/
├── .github/
│   └── workflows/
│       └── deploy.yml     # CI/CD — auto deploy on push to main
│
├── src/                   # Source — single source of truth
│   ├── css/
│   │   ├── base.css       # Design tokens, reset, typography
│   │   ├── layout.css     # Background, topbar, footer
│   │   └── components.css # Shared UI components
│   ├── js/
│   │   ├── data.js        # Static data and constants
│   │   ├── storage.js     # localStorage helpers
│   │   └── ui.js          # DOM utilities
│   └── pages/             # All HTML pages
│
├── .gitignore
├── CHANGELOG.md
├── LICENSE
└── README.md
```

---

## Getting Started

```bash
git clone https://github.com/AbdulrahmanElwardany/LifeSystem.git
cd LifeSystem
open src/pages/index.html
```

No build step. No dependencies. Just open and run.

---

## Stack

- **HTML5 / CSS3 / Vanilla JS** — zero dependencies
- **GitHub Actions** — CI/CD pipeline
- **GitHub Pages** — free hosting

---

## License

MIT © [Abdulrahman Elwardany](https://github.com/AbdulrahmanElwardany)
