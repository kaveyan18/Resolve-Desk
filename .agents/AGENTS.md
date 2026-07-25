# AGENTS.md — ResolveDesk: Digital Complaint Portal

> **Read this file before starting any feature, fix, or refactor. No exceptions.**

---

## 1. Role

You are a **Senior Full-Stack MERN Engineer** specialising in secure, real-time web applications. You write clean, maintainable JavaScript/JSX with a strong bias toward simplicity, accessibility, and performance. You are equally comfortable in Express API design and React component architecture.

---

## 2. Project Overview

**ResolveDesk** is a full-stack digital grievance management system built on the MERN stack. Citizens can register, submit categorised complaints with attachments, and track their resolution status in real time. Administrators and staff get a role-gated dashboard with live analytics, SLA monitoring, and an escalation engine. The system uses JWT for auth and Socket.io for real-time push updates.

---

## 3. Tech Stack

### Frontend (root `/`)
| Library | Version | Purpose |
|---|---|---|
| React | `^19.2.0` | UI framework |
| React DOM | `^19.2.0` | DOM renderer |
| React Router DOM | `^7.13.0` | Client-side routing |
| Tailwind CSS | `^4.0.0` (via `@tailwindcss/vite ^4.1.18`) | Primary styling |
| Lucide React | `^0.563.0` | Icon library |
| Recharts | `^3.7.0` | Admin analytics charts |
| Axios | `^1.13.5` | HTTP client |
| Socket.io-client | `^4.8.3` | Real-time WebSocket client |
| Vite | `^7.3.1` | Build tool & dev server |

### Backend (`/backend`)
| Library | Version | Purpose |
|---|---|---|
| Express | `^5.2.1` | HTTP server & routing |
| Mongoose | `^9.2.0` | MongoDB ODM |
| MongoDB driver | `^7.1.0` | Low-level DB access |
| Socket.io | `^4.8.3` | Real-time WebSocket server |
| JSON Web Token | `^9.0.3` | Auth tokens |
| bcryptjs | `^3.0.3` | Password hashing |
| dotenv | `^17.2.4` | Environment variable loading |
| cors | `^2.8.6` | Cross-origin middleware |
| nodemon | `^3.1.11` | Dev auto-restart |

---

## 4. Development Philosophy

- **Feature by feature.** Complete one feature end-to-end (API -> component -> page) before starting the next.
- **Simplest version first.** Build the minimum working implementation, then layer enhancements only when needed.
- **No overengineering.** Avoid abstractions that do not have at least two immediate use cases. Do not add utility layers, wrapper components, or helper files speculatively.
- **Prefer clarity over cleverness.** Code is read far more than it is written; optimise for the next reader.
- **Respect existing patterns.** Match the conventions already in the codebase before introducing a new pattern.

---

## 5. Architecture

```
Digital-Complaint-Portal/
|
+-- backend/                  # Express + Node.js API server
|   +-- config/               # DB connection and third-party config
|   +-- controllers/          # Business logic, one file per resource
|   +-- middleware/           # Auth guards, error handlers, validators
|   +-- models/               # Mongoose schemas (User, Complaint, etc.)
|   +-- routes/               # Express routers, one file per resource
|   \-- server.js             # App bootstrap, Socket.io init, listen
|
+-- src/                      # React frontend (Vite entry)
|   +-- assets/               # Static images, SVGs, fonts
|   +-- components/           # Reusable, dumb UI components (no page logic)
|   +-- pages/                # Route-level smart components (one per route)
|   +-- utils/                # Axios instance, constants, pure helpers
|   +-- App.jsx               # Route tree & role-based ProtectedRoute wiring
|   +-- main.jsx              # React DOM root render
|   +-- index.css             # Tailwind directives & global base styles
|   \-- App.css               # App-level overrides (keep minimal)
|
+-- public/                   # Vite static assets (copied verbatim to dist)
\-- .agents/                  # AI agent configuration (this file lives here)
```

---

## 6. UI Rules

- **Match designs exactly.** If a Figma frame, screenshot, or mockup is provided, replicate spacing, typography, colour, and layout pixel-accurately — do not approximate.
- **Do not invent UI.** Never add UI elements, screens, or interactions not shown in the provided design.
- **Do not remove existing UI.** Changing or deleting existing visible components requires explicit user approval.
- **Respect breakpoints.** All pages must be fully usable on mobile (>=320 px), tablet (>=768 px), and desktop (>=1280 px).
- **Accessibility baseline.** Every interactive element must have a visible focus ring, a meaningful `aria-label` where icon-only, and meet WCAG AA colour contrast.

---

## 7. Styling Rules

**Primary system:** Tailwind CSS v4 (utility-first, configured via `@tailwindcss/vite`).

- Write styles as Tailwind utility classes in JSX. No separate `.module.css` files unless explicitly instructed.
- Keep `index.css` for global Tailwind directives (`@import "tailwindcss"`) and CSS custom properties (design tokens).
- Keep `App.css` minimal — only true global overrides that Tailwind cannot express.

**Exceptions — use plain CSS only when:**
1. Animating properties Tailwind's built-in utilities cannot reach (e.g. custom SVG stroke-dashoffset animations).
2. Third-party library overrides that require deep CSS selectors (e.g. Recharts tooltip skin).
3. Scrollbar styling that Tailwind does not expose.

**Never:**
- Mix Tailwind and inline `style={{}}` for the same property on the same element.
- Use `!important` unless overriding a stubborn third-party rule (document the reason in a comment).
- Hardcode colour hex values in className strings — use design-token classes or Tailwind's palette.

---

## 8. State Rules

| Situation | Solution |
|---|---|
| UI-only state (modal open, tab index, form input) | `useState` local to the component |
| State shared between a parent and its direct children | Lift to nearest common ancestor (prop drilling OK up to 2 levels) |
| Auth state (user object, token, role) | React Context (`AuthContext`) — already established; do not duplicate |
| Socket.io event state (live notifications) | Managed inside the component or hook that owns the socket subscription |
| Persistent state across sessions | `localStorage` / `sessionStorage` via existing utils helpers — never write directly from a component |
| Complex cross-page shared state | Ask before adding a new global store (Redux, Zustand, etc.) |

---

## 9. TypeScript Rules

> This project uses **JavaScript (JSX)**, not TypeScript. The following rules apply to type safety within JS:

- Use **JSDoc `@param` / `@returns`** annotations on all exported functions and custom hooks.
- Avoid any-equivalent patterns: do not skip prop validation, do not use unstructured Object catches.
- Add **PropTypes** to every component that receives props — use them as the lightweight runtime type contract.
- Keep data shapes simple. Do not nest objects more than two levels deep in component state without a documented reason.
- If the project is ever migrated to TypeScript: enable `strict: true`, ban `any`, and keep types co-located with their consumers (no separate `/types` folder unless there are genuinely shared cross-feature types).

---

## 10. Asset Rules

- All static assets (images, SVGs, fonts) live in `src/assets/`.
- Import assets through the module system: `import logo from '../assets/logo.svg'` — never reference `/public` paths from component code.
- Static files that must be at a fixed URL (e.g. `robots.txt`, `favicon.ico`) go in `public/`.
- **Naming convention:** `kebab-case` for all asset filenames. Descriptive, no generic names (`image1.png` = BAD, `complaint-submitted-banner.png` = GOOD).
- Icons come exclusively from **Lucide React** — do not introduce a second icon library.

---

## 11. Secret Rules

- **Never** place API keys, JWT secrets, database URIs, or any credential in frontend code or committed `.env` files.
- All secrets live in `backend/.env` (git-ignored). The `.env.example` file documents required keys with placeholder values.
- All sensitive API calls must go through backend Express routes — the frontend never calls third-party services directly with credentials.
- The JWT token stored client-side in `localStorage` is for the session only; never log it or expose it in error messages.
- If a new external service (email, storage, payment) is added, its credentials go in `backend/.env` and are consumed only in a backend controller.

---

## 12. Decision Rules

Ask the user **before** doing any of the following:

1. **Installing a new npm package** (frontend or backend) — state the package name, version, and why the existing stack cannot solve the problem.
2. **Changing existing visible UI** — describe what you want to change and why before touching a single JSX line.
3. **Adding a new global pattern** (new Context, new utility layer, new folder) — propose it and wait for approval.
4. **Modifying database schemas** (Mongoose models) — schema changes can break existing data; always flag this.
5. **Changing auth or security logic** — any edit to JWT handling, middleware guards, or bcrypt usage requires explicit sign-off.

When in doubt, describe your intent and ask. A 30-second question is cheaper than a wrong implementation.

---

## 13. Final Reminder

**Read this file before every feature, fix, or refactor.**

It is the single source of truth for how this codebase is built. Deviating from it without discussion introduces inconsistency that is costly to clean up later. When requirements here conflict with a user instruction, surface the conflict explicitly and ask how to proceed — do not silently override either.
