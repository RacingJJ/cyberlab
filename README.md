# CyberLab

CyberLab is an open-source, browser-based cybersecurity learning platform with safe, simulated labs and guided lessons. This repository contains a runnable first-release that works in the browser and can be packaged as a desktop application for Windows and Linux using Electron.

This README focuses on getting you up and running quickly and troubleshooting common issues.

## Quick facts
- Language: TypeScript + CSS + JavaScript + HTML
- UI: React + Vite + Tailwind-like styles
- Local persistence: localStorage
- Safe: all datasets and terminals are simulated — no external scanning or host command execution

---

## Quick start (browser development)
These steps get the app running locally in your browser in under 2 minutes.

Prerequisites
- Node.js 18+ (recommended)
- npm 9+ or yarn

Commands
1. Clone the repo

   git clone https://github.com/RacingJJ/cyberlab.git
   cd cyberlab

2. Install dependencies

   npm ci

3. Start the dev server

   npm run dev

4. Open the app
- Visit http://localhost:5173 in your browser

Notes
- The Vite dev server supports fast refresh while you edit source files.

---

## Desktop (Electron) — development
You can open the app in an Electron window for a desktop-like experience.

1. Start Vite and Electron together

   npm run dev:electron

2. Behavior
- This task launches the Vite server and opens an Electron window that points to http://localhost:5173.
- Electron binaries are downloaded by the electron package the first time you run it.

Security note
- The Electron build uses a preload script and context isolation. The app is intentionally sandboxed and does not expose node APIs to the renderer.

---

## Build (web)
Create a static production build served from dist/

npm run build

To preview the production build locally:

npm run preview

---

## Desktop packaging (Windows & Linux)
electron-builder is configured in package.json to produce Windows (portable / NSIS) and Linux (AppImage / .deb) artifacts.

Local build (recommended on the same OS as target)

1. Build the web assets

   npm run build

2. Build installers

   npm run electron:build

Important notes
- Building Windows installers on Linux/macOS may require wine and additional tooling — it is easier and more reliable to run the build on a native Windows runner.
- For CI releases, use GitHub Actions with different runners (windows-latest for Windows and ubuntu-latest for Linux). I can add workflow files if you want automated builds.
- Code signing is optional but recommended for Windows installers to reduce SmartScreen warnings. To sign, add the signing keys to your electron-builder configuration and set secrets in CI.

---

## Tests
Run unit/integration tests with Vitest:

npm run test

The repo includes example tests for core UI pieces and the terminal simulator.

---

## Common tasks & troubleshooting
- "Cannot find module 'electron'" — make sure devDependencies were installed (npm ci) and that you run dev:electron from the project root.
- "Port 5173 in use" — change Vite server port in vite.config.ts or kill the process using the port.
- Windows build fails on Linux runner — use windows-latest runner in CI or install wine + nsis on the Linux host (not recommended).
- App crashes in Electron production — run the built AppImage or portable locally to see crash logs. For advanced debugging, enable `app.isPackaged` checks in main.js and add logging.

---

## Project layout (short)
- src/ — application source
  - components/, pages/, features/ (lessons, labs, terminal, networking)
  - data/ — sample lesson content, labs, and quizzes
  - lib/ — local persistence helpers
  - styles/ — global styles
- main.js, preload.js — Electron entrypoints
- package.json — scripts and electron-builder config

---

## Security and Responsible Use
- All labs use fictional datasets and simulated behavior. Do not use CyberLab to scan or attack real hosts or services.
- The terminal is simulated with an allowlist of commands. It does not execute the host shell.
- Password inputs in the Password Strength lab are processed locally and are not transmitted or stored remotely.

If you find a security issue in the repo, see SECURITY.md and please report responsibly.

---

## Contributing
Contributions are welcome! Please see CONTRIBUTING.md for guidelines on patches, tests, and the code of conduct.

To quickly test changes:
1. Create a branch
2. Make changes and run npm run dev
3. Add tests and run npm run test
4. Open a pull request

---

## Releases & CI (recommended)
I recommend adding GitHub Actions to build artifacts on native runners and publish releases. Example workflow:
- Build web and electron artifacts on OS-specific runners (windows-latest, ubuntu-latest)
- Upload artifacts and create a GitHub Release on tag push (vX.Y.Z)

Tell me if you want me to add the workflows — I can add a release.yml and pages.yml and wire up publishing (you will need to add the GH_TOKEN secret for automated Release publishing).

---

## License
This project is MIT licensed. See LICENSE for full text.

---

If anything in this README is unclear or you want a smaller quickstart script (for example a single shell command that installs deps and runs dev), tell me which shell environment you use and I’ll add a convenience script and an example GitHub Actions workflow to build the Windows and Linux releases automatically.