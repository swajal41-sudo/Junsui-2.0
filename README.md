<![CDATA[<div align="center">

# ⛩ Junsui 2.0

### *純粋 — Pure, Simple Attendance*

**A modern, mobile-first attendance management system built for Guru Nanak Institute of Technology, Nagpur.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Dexie.js](https://img.shields.io/badge/Dexie.js-IndexedDB-3B82F6?style=for-the-badge)](https://dexie.org/)
[![License](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge)](#license)

---

*Junsui (純粋) means "pure" in Japanese — reflecting the app's philosophy of clean, distraction-free attendance taking.*

</div>

---

## ✨ What's New in 2.0

Junsui 2.0 is a **complete rewrite** from vanilla JavaScript to a modern React architecture. Everything has been rebuilt from scratch for speed, maintainability, and a premium user experience.

| Feature | v1.0 (Legacy) | v2.0 (Current) |
|---------|:---:|:---:|
| **Framework** | Vanilla JS (single 887-line file) | React 19 + Vite 8 |
| **Routing** | Screen toggling via DOM manipulation | React Router v7 with protected routes |
| **Auth** | None | Firebase Auth + PIN-based login |
| **UI** | Basic CSS | Glassmorphism dark theme with Framer Motion animations |
| **Database** | Dexie v1 | Dexie v3 with improved schema |
| **Exports** | Excel only | PDF (jsPDF) + Excel (SheetJS) |
| **Architecture** | Monolithic | Component-based with Context API |
| **Student Data** | Hardcoded in single file | Modular data maps across 4 branches |

---

## 🎯 Features

### 🔐 PIN-Based Authentication
- Sleek numpad interface inspired by iOS lock screen
- 4-digit PIN entry with auto-submit
- Toggle PIN visibility with eye icon
- Firebase Auth integration with graceful fallback

### 📋 Smart Session Setup
- **Auto-detect subject** based on day & hour using built-in timetable
- **Auto-fill date & time** — today's date and current hour pre-populated
- Support for 4 branches: `CSE`, `ETC`, `CSE-DS`, `CSE-CS`
- 5 pre-configured subjects: Data Structures, OOP, DBMS, CN, OS
- Configurable student count per session

### 📞 Animated Attendance Call
- **Card-based UI** — each student appears as an animated card (Framer Motion spring physics)
- One-tap **Present / Absent** marking with large touch targets
- **Undo support** — instantly revert the last action
- Real-time roll number display with formatted branch prefix (e.g., `CSE-035`)
- **Real student names** — 197 students across all 4 branches pre-loaded

### 📊 Session Report
- Complete attendance table with all students listed
- **Inline status toggle** — tap any student's badge to flip between Present/Absent
- Color-coded status pills (`P` = green, `A` = red)
- Session metadata display (date, branch, subject)

### 📤 Multi-Format Export
- **PDF Export** — generates professional attendance sheet via jsPDF with auto-table formatting
- **Excel Export** — creates `.xlsx` file with proper columns via SheetJS
- Filenames auto-formatted: `Attendance_CSE_2026-07-17.pdf`

### 📜 Attendance History
- Browse all past sessions stored in IndexedDB (Dexie)
- Sessions grouped by date, subject, branch, and time slot
- Drill into any session to see the full student-wise report
- Sorted newest-first for quick access

---

## 🛠 Tech Stack

```
Frontend        React 19 + JSX
Build Tool      Vite 8
Routing         React Router DOM v7
Animations      Framer Motion
Icons           Lucide React
Styling         Vanilla CSS (Glassmorphism dark theme, Outfit font)
Auth            Firebase Authentication
Database        Dexie.js (IndexedDB wrapper)
PDF Export      jsPDF + jsPDF-AutoTable
Excel Export    SheetJS (xlsx)
Linting         oxlint
```

---

## 📁 Project Structure

```
Junsui/
├── index.html                 # Entry point
├── package.json               # Dependencies & scripts
├── vite.config.js             # Vite configuration
├── legacy_app.js              # v1.0 vanilla JS (archived)
│
├── public/
│   ├── favicon.svg            # App icon
│   └── icons.svg              # SVG icon sprites
│
└── src/
    ├── main.jsx               # React DOM root
    ├── App.jsx                # Router + protected routes
    │
    ├── contexts/
    │   └── AuthContext.jsx    # Firebase auth state management
    │
    ├── pages/
    │   ├── Login.jsx          # PIN numpad login screen
    │   ├── Dashboard.jsx      # Home — start session or view history
    │   ├── Setup.jsx          # Configure branch, subject, time, date
    │   ├── Call.jsx           # Animated roll call (Present/Absent)
    │   ├── Report.jsx         # Session summary + PDF/Excel export
    │   └── History.jsx        # Browse past attendance sessions
    │
    ├── db/
    │   ├── db.js              # Dexie database schema
    │   └── students.js        # Student name data (CSE, ETC, CS, DS)
    │
    ├── services/
    │   └── firebase.js        # Firebase app initialization
    │
    └── styles/
        ├── global.css         # Design system, cards, buttons, inputs
        └── login.css          # PIN numpad & login-specific styles
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/swajal41-sudo/Junsui-2.0.git
cd Junsui-2.0

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be running at `http://localhost:5173`

### Default Login

```
PIN: 2609
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run oxlint for code quality |

---

## 🎨 Design System

Junsui 2.0 features a **premium dark theme** with glassmorphism design language:

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-dark` | `#09090b` | Page background |
| `--card-bg` | `rgba(24, 24, 27, 0.6)` | Frosted glass cards |
| `--primary-btn` | `#6366f1` | Indigo — primary actions |
| `--present-btn` | `#10b981` | Emerald — present status |
| `--absent-btn` | `#f43f5e` | Rose — absent status |

- **Font**: [Outfit](https://fonts.google.com/specimen/Outfit) — a geometric sans-serif for a modern feel
- **Cards**: `backdrop-filter: blur(20px)` with subtle inner glow borders
- **Buttons**: Gradient fills with glow shadows and spring hover animations
- **Inputs**: Semi-transparent with indigo focus rings

---

## 🏫 Supported Branches & Student Count

| Branch | Full Name | Students |
|--------|-----------|:--------:|
| `CSE` | Computer Science & Engineering | 44 |
| `ETC` | Electronics & Telecommunication | 51 |
| `CSE-CS` | Computer Science — Cyber Security | 48 |
| `CSE-DS` | Computer Science — Data Science | 54 |

All **197 student names** are pre-loaded for the 2nd Year batch at GNIT, Nagpur.

---

## 🗄 Database Schema

Junsui uses **Dexie.js** (IndexedDB) for fully offline, client-side storage:

```javascript
db.version(3).stores({
  students:         '++id, rollNo, name, totalClasses, attendedClasses',
  attendance:       '++id, studentId, date, status, timestamp, subject, timeSlot, branch',
  queue:            '++id, studentId, date, status, timestamp, subject, timeSlot, branch',
  student_registry: '[branch+rollNo], branch, rollNo, name'
});
```

> **Offline-First**: All data lives in the browser. No internet required after the initial page load.

---

## 📱 App Flow

```
┌──────────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐
│  Login   │────▶│ Dashboard │────▶│  Setup   │────▶│   Call   │
│ (PIN)    │     │           │     │ (Config) │     │ (P / A)  │
└──────────┘     └─────┬─────┘     └──────────┘     └────┬─────┘
                       │                                  │
                       │                                  ▼
                 ┌─────▼─────┐                     ┌──────────┐
                 │  History  │◀────────────────────│  Report  │
                 │ (Browse)  │                     │ (Export) │
                 └───────────┘                     └──────────┘
```

---

## 🔮 Roadmap

- [ ] Cloud sync with Firebase Firestore
- [ ] Google Sheets integration (restore from v1.0)
- [ ] Cumulative attendance analytics & defaulter alerts
- [ ] PWA support with offline-first caching
- [ ] Multi-user roles (Teacher / HOD / Admin)
- [ ] Dark/Light theme toggle
- [ ] Bulk import students from Excel

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

```bash
# Fork the repo, create your branch
git checkout -b feature/amazing-feature

# Make your changes and commit
git commit -m "Add amazing feature"

# Push and open a PR
git push origin feature/amazing-feature
```

---

## 👤 Author

**Swajal Indorkar**
- GitHub: [@swajal41-sudo](https://github.com/swajal41-sudo)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**⛩ Built with ❤️ for GNIT Nagpur**

*Junsui 2.0 — Pure Attendance, Simplified.*

</div>
]]>
