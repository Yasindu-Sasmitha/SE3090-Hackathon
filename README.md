# SafeLK (සැලකිලිමත් / பாதுகாப்பான இலங்கை)
### Sri Lanka Community Safety & Hazard Reporting System
> **SE3090 Mini Hackathon 2026 — Build for Sri Lanka**

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)]()
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-blue)]()
[![Backend](https://img.shields.io/badge/Backend-ASP.NET%20Core%209.0-purple)]()
[![Database](https://img.shields.io/badge/Database-PostgreSQL-336791)]()
[![Hackathon](https://img.shields.io/badge/Focus-Community%20Safety-red)]()

---

## 🇱🇰 Selected Sri Lankan Problem
In Sri Lanka, public infrastructure hazards frequently lead to preventable fatal accidents, vehicle breakdowns, and prolonged community distress:
- **Monsoon Storm Drains:** Uncovered concrete road drains in Colombo, Kandy, and suburban towns overflow during heavy rains, posing severe drowning or injury risks to pedestrians.
- **Dark Walkways & Broken Streetlights:** Prolonged streetlight breakdowns along main bus corridors compromise commuter and women's safety after dark.
- **Dangerous Road Potholes:** Unrepaired deep potholes on A- and B-grade national routes (e.g. Galle Road, Kandy Road, High Level Road) cause recurring motorcycle and three-wheeler accidents.
- **Fragmented Reporting:** Citizens lack an immediate, centralized digital method to notify the responsible local body (**RDA, CEB, DMC, Municipal Councils / Pradeshiya Sabhas**).

---

## 💡 Proposed Solution
**SafeLK** bridges the gap between Sri Lankan citizens and municipal response authorities:
1. **Instant Hazard Flagging:** Citizens quickly submit geotagged incident reports categorized by problem type, Sri Lankan district, specific location, and severity level.
2. **Transparent Lifecycle Tracking:** Every incident is publicly trackable through distinct lifecycle stages: `Reported` ➔ `In Progress` ➔ `Resolved`.
3. **Multi-Criteria Public Feed:** Community members can filter hazards by 25 Sri Lankan districts, severity, and category, and view real-time computed safety analytics.
4. **Authority Portal:** Local council officers can triage high-risk alerts, assign dispatch crews, and update resolution statuses in real time.
5. **Emergency Hotlines Integration:** Quick 1-click access to Sri Lankan national response hotlines (**119 Police, 1990 Suwa Seriya Ambulance, 110 Fire & Rescue, 1987 CEB**).

---

## 🚀 Main Features
- [x] **In-App Sri Lankan Problem Context:** Dedicated hero card highlighting local hazard statistics and community impact.
- [x] **Real-Time Safety Analytics:** Dynamically calculated metrics (Total Reports, High-Risk Critical Alerts, In-Progress Investigations, Resolved Issues).
- [x] **Smart Hazard Submission Form:**
  - Sri Lankan district dropdown (all 25 districts).
  - Specific location & landmark input.
  - Category selector (Roads, Streetlights, Drains, Fallen Trees, Public Areas).
  - Urgency & Severity level selector (Low, Medium, High).
  - Robust client-side validation with friendly Sri Lanka-tailored error feedback using Zod.
- [x] **Multi-Dimensional Search & Filtering:**
  - Live full-text keyword search across titles, locations, and descriptions.
  - District filter (Colombo, Kandy, Galle, Gampaha, etc.).
  - Category chips with visual icons.
  - Severity and Status filters.
  - Dynamic sorting (Newest first, Highest Risk first).
- [x] **Detailed Incident Profile & Lifecycle Timeline:** Inspect specific reports, review designated Sri Lankan authorities, confirm incidents through community verification.
- [x] **Officer Resolution Portal (Admin):** Status updates (`Reported` ➔ `In Progress` ➔ `Resolved`), incident management, with demo auto-fill credentials for examiners.
- [x] **Mobile-Responsive Interface:** Optimized for both mobile devices on the go and desktop command dashboards.

---

## 🛠️ Technologies Used
- **Frontend:**
  - React 19 + Vite (Modern, lightning-fast SPA)
  - React Router DOM v7 (Client-side routing)
  - React Hook Form + Zod (Strict schema validation with custom error handling)
  - Axios (HTTP client with JWT Bearer interceptor)
  - Vanilla CSS with custom tokens (Responsive, dark/light balanced civic palette)
- **Backend:**
  - ASP.NET Core 9.0 Web API (C#)
  - Entity Framework Core with PostgreSQL provider (Npgsql)
  - JWT Authentication & Role-Based Authorization
  - Swagger / OpenAPI documentation
- **Database:**
  - PostgreSQL (Relational schema for SafetyReports and Users)

---

## 🤖 AI Declaration & Usage Log

### AI Declaration
As required by the SE3090 Mini Hackathon guidelines:
- **Antigravity / Gemini AI** was utilized for brainstorming Sri Lankan problem context, drafting the responsive frontend design system, generating localized sample dataset entries, and formulating the schema validation rules. All generated code and logic were manually reviewed, integrated with the ASP.NET Core backend endpoints, tested for role authorizations, and validated for build correctness.

### AI Prompt Log
| Tool | Exact / Core Prompt | Purpose | Verification & Modifications |
|---|---|---|---|
| Antigravity AI | *"Design a community safety reporting frontend for Sri Lanka (SafeLK) with district dropdowns, hazard reporting form with zod validation, live metrics calculation, and filter tabs."* | Generate UI structure and validation schemas | Verified field names match backend `CreateSafetyReportDto`, customized styling and localized error messages. |
| Antigravity AI | *"Create Sri Lanka specific sample hazard dataset with realistic locations (Galle Rd, Kandy Lake, Pelawatta, Kelaniya) and emergency hotline mappings."* | Populate realistic local demonstration data | Checked accuracy of Sri Lankan emergency numbers (119, 1990, 110, 1987) and realistic road contexts. |
| Antigravity AI | *"Fix Admin and Auth integration so status update endpoint works seamlessly for demonstration."* | Connect UI to backend PUT status endpoint | Tested JWT claims generation and ensured proper authorization flow. |

---

## 👥 Team Member Details & Contributions

| Member Name | Student ID | Primary Role | Contributions |
|---|---|---|---|
| Member 1 | [Enter ID] | Problem & Solution Design / Backend | Problem framing, ASP.NET Core API endpoints, DB Migrations |
| Member 2 | [Enter ID] | Frontend UI & Styling | Component architecture, responsive design, CSS design system |
| Member 3 | [Enter ID] | Functional Implementation & Validation | Zod form validation, search & filtering logic, metrics calculation |
| Member 4 | [Enter ID] | Testing, Deployment & Video | Testing, Git documentation, deployment setup, demo video |

---

## ⚙️ Installation & Local Execution

### Prerequisites
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download)
- [Node.js (v18+)](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### 1. Backend Setup
```bash
cd backend/BoilerplateApi
dotnet restore
dotnet ef database update
dotnet run
```
The API will launch at `http://localhost:5262` (Swagger at `http://localhost:5262/swagger`).

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The application will launch at `http://localhost:5173`.

---

## 🔗 Project Links
- **Deployed Application:** `[Add Deployed Vercel/Render Link Here]`
- **2-Minute Demonstration Video:** `[Add OneDrive/YouTube Video Link Here]`
- **GitHub Repository:** `[Add GitHub Repository Link Here]`

---

*Build for Sri Lanka — SE3090 Mini Hackathon 2026* 🇱🇰
