# Adaptive To-Do App

## Overview

**Adaptive To-Do App** is a modern, responsive task management application built with **Next.js** and **TypeScript**. It demonstrates adaptive interface design by automatically adjusting the UI based on user workload, overdue tasks, and user experience level. The app includes:

- A Kanban board, list view, and timeline view.
- Adaptive **Focus Mode** (formerly Catch Up Mode) that proposes a low‑cognitive‑load view when the user is overwhelmed.
- Dynamic overdue‑task detection that only triggers when a task's due date is **strictly before today**.
- Manual entry of Focus Mode directly from the main page.
- Theme support (auto, light, dark) and responsive design.

The codebase is structured to be easy to extend and serves as a teaching example for adaptive UI patterns.

---

## Features

| Feature | Description |
|---|---|
| **Adaptive Layout** | Main container width is `max-w-7xl` for a spacious Kanban view. |
| **Task Card Buttons** | Edit/Delete appear on hover (desktop) or active/focus (mobile). |
| **Focus Mode** | Prompt appears when workload ≥ 4 **or** there are overdue tasks. |
| **Overdue Logic** | A task is overdue only if `dueDate` is before the start of today (ignores time). |
| **Manual Focus Trigger** | Button on the main page to manually enter Focus Mode. |
| **Theme Mode** | Auto (day/night), Light, Dark – respects system time. |
| **Simulation Panel** | "Stress" button simulates overload, triggering Focus Mode proposal. |
| **Responsive UI** | Works on desktop and mobile with adaptive navigation. |

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or later)
- **npm** (or **yarn** / **pnpm**)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd adaptive-todo-app

# Install dependencies
npm install   # or `yarn` / `pnpm install`
```

### Development Server

```bash
npm run dev   # Starts the app at http://localhost:3000
```

The page auto‑reloads as you edit files.

---

## Architecture Overview

### Directory Structure

```
src/
├─ app/                # Next.js app router (pages, layout, etc.)
│   ├─ page.tsx        # Home page – contains view switcher and manual Focus button
│   └─ layout.tsx      # Global layout wrapper
├─ components/         # Reusable UI components
│   ├─ AdaptiveLayout.tsx   # Main layout, sidebar, and navigation
│   ├─ TaskItem.tsx         # Individual task card
│   ├─ PanicProposalModal.tsx   # Focus Mode proposal modal
│   ├─ SimulationPanel.tsx   # Stress button for testing overload
│   └─ …
├─ context/            # React context for global state
│   └─ UserContext.tsx   # Holds tasks, user mode, metrics, adaptive logic
├─ types/              # TypeScript type definitions
└─ styles/             # Global CSS (if any)
```

### Core Concepts

- **UserContext** – Central store for tasks, user mode (`BEGINNER`, `INTERMEDIATE`, `EXPERIENCED`), cognitive load (`LOW`, `HIGH`, `PANIC`), and adaptive metrics. It also calculates `overdueCount` on each render.
- **Focus Mode Logic** – Implemented in `UserContext`'s `useEffect`. The prompt appears when `totalWorkload >= 4` **or** `overdueCount > 0`. It automatically resets when workload drops below 4 **and** there are no overdue tasks.
- **Manual Trigger** – Rendered in `app/page.tsx`. Clicking the button sets `cognitiveLoad` to `'PANIC'`, showing the low‑cognitive‑load UI.
- **Theme Mode** – Controlled via `themeMode` (`AUTO`, `LIGHT`, `DARK`). Auto mode switches based on the current hour.

---

## Adaptive Features Detail

### Focus Mode (formerly Catch Up Mode)

- **When it appears**:
  1. **High workload** – 4 or more incomplete tasks.
  2. **Overdue tasks** – Any task whose `dueDate` is before the start of today.
- **What it does**:
  - Shows a banner "Focus Mode Active. Let's just do one thing."
  - Reduces visual clutter and highlights a single task.
  - Provides a button to exit back to normal mode.
- **Manual entry** – A button on the main page (`Enter Focus Mode`) lets users invoke it directly.

### Overdue Task Calculation

```ts
const now = new Date();
const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const overdueCount = tasks.filter(t =>
  !t.completed && t.dueDate && new Date(t.dueDate) < startOfToday
).length;
```

This ensures tasks added **today** (e.g., via Quick Add) are not considered overdue until tomorrow.

---

## Development Scripts

| Script | Description |
|---|---|
| `dev` | Starts the development server (`npm run dev`). |
| `build` | Builds the production bundle (`npm run build`). |
| `start` | Runs the production server (`npm run start`). |
| `lint` | Runs ESLint to check code quality. |

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Make your changes and ensure the app still builds.
4. Run `npm run lint` and fix any issues.
5. Open a Pull Request describing the changes.

When adding new adaptive logic, update the **Focus Mode** documentation accordingly.

---

## License

This project is licensed under the MIT License – see the `LICENSE` file for details.

---

## Acknowledgements

- Built with **Next.js** and **TypeScript**.
- UI icons from **lucide-react**.
- Inspired by adaptive interface research and the original "Catch Up Mode" implementation.

---

*Happy coding!*
