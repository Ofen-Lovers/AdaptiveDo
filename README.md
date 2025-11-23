# Adaptive To-Do App

[Deployed in Vercel](https://adaptive-do.vercel.app/)

## Overview

**Adaptive To-Do App** is a modern, responsive task management application built with **Next.js** and **TypeScript**. It demonstrates adaptive interface design by automatically adjusting the UI based on user workload, overdue tasks, and user experience level. The app includes:

- Kanban, list, and timeline views.
- Adaptive **Focus Mode** (formerly Catch Up Mode) that proposes a low‑cognitive‑load view when the user is overwhelmed.
- Dynamic overdue‑task detection (tasks overdue only if due date is before today).
- Manual entry of Focus Mode directly from the main page.
- Theme support (auto, light, dark) and responsive design.

The implementation satisfies the laboratory activity described in the [instructions](file:///home/kvass/.gemini/antigravity/scratch/adaptive-todo-app/instructions.md).

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
│   ├─ page.tsx        # Home page – view switcher and manual Focus button
│   └─ layout.tsx      # Global layout wrapper
├─ components/         # Reusable UI components
│   ├─ AdaptiveLayout.tsx   # Main layout, sidebar, navigation
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

- **UserContext** – Central store for tasks, user mode (`BEGINNER` < 30, `INTERMEDIATE` 30-79, `EXPERIENCED` 80+), cognitive load (`LOW`, `HIGH`, `PANIC`), and adaptive metrics. It also calculates `overdueCount` on each render.
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

## Lab Assignment Alignment

The following sections map the implementation to the requirements outlined in the [lab instructions](file:///home/kvass/.gemini/antigravity/scratch/adaptive-todo-app/instructions.md):

- **User Model** – Supports the required **Beginner** and **Experienced** states, plus a **Behavior‑Based** state (overdue tasks trigger Focus Mode). See *User Model* section in the instructions.
- **Adaptive Variations** – Beginner Mode offers onboarding and simplified UI; Experienced Mode provides Quick Add and compact layout; the behavior‑based adaptation is realized via the overdue‑task logic and Focus Mode proposal.
- **Figma Prototype Requirements** – Capture screens for Beginner, Experienced, and Focus Mode states. Annotate conditional logic (`totalWorkload >= 4` or `overdueCount > 0`).
- **Usability Testing & Heuristic Evaluation** – The **Simulation Panel** and **Stress** button enable overload scenarios for testing, matching the *Usability Testing* section.
- **Ethical Reflection** – Design respects autonomy by prompting only when needed and offering a manual override, aligning with the *Ethical Reflection* guidelines.
- **Submission Guidelines** – Repository already contains required artifacts (README, code, `user_model.md`). Add screenshots of the three adaptive states and the heuristic report to complete the submission.

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
