# Changelog

All notable changes to this project are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

---

## [1.1.0] - 2026-04-13

### Changed
- Removed redundant `docs/` folder — `src/` is now the single source of truth
- Updated CI/CD to deploy `src/` directly to GitHub Pages
- Rewrote README with live URL, accurate structure, and clean formatting
- Added MIT LICENSE

### Fixed
- CSS conflict between shared `components.css` and page-specific styles

---

## [1.0.0] - 2026-04-13

### Added
- Initial release — 10-page personal dashboard
- Dashboard with streak ring, quick stats, and navigation
- Overall Progress, Daily Planner, Goals Planner, Checklist
- Reminders, IDOR Writeups, 3 Learning Roadmaps
- Shared CSS architecture (`base.css`, `layout.css`, `components.css`)
- Shared JS modules (`data.js`, `storage.js`, `ui.js`)
- GitHub Actions CI/CD pipeline
