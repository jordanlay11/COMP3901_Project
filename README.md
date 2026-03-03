Link for Figma with project wireframes and architecture diagram
https://www.figma.com/design/4bOAcgNMpTl3zsbmuKRbPh/Untitled?node-id=0-1&t=d41KImDfitJlp0OD-1

Link for Google Doc with project information and planning
https://docs.google.com/document/d/16dKeV_OgdPc54RCsI9KOy-QtmX9rlxQKQdSq9o-G0RI/edit?tab=t.0

---

System Requirements for testing
- [Node.js](https://nodejs.org) (version 18 or higher) — download and install the LTS version
- [Git](https://git-scm.com/downloads) — for cloning the repository
- [Expo Go](https://expo.dev/go) — **only if** you want to browse the app UI (push notifications won't work in Expo Go)

To check if Node.js is installed, open your terminal and run:
```bash
node --version
```

## Step 1 — Clone the Repository

Open your terminal, navigate to where you want the project, and run:

```bash
git clone https://github.com/jordanlay11/COMP3901_Project.git
```

npm install

## Step 4 — Running the Project

```bash
cd web
npm run dev
```

Then open your browser and go to: **http://localhost:3000**

**Terminal 2 — Backend Server:**

```bash
cd backend
node server.js
```

You should see: `Backend running on http://localhost:4000`

**Terminal 3 — Mobile App:**

```bash
cd mobile
npx expo start --dev-client --tunnel
```

A QR code will appear in the terminal. Scan it with the development build app on your phone.

---
## Project Structure

```
COMP3901_PROJECT/
├── web/          → Next.js web dashboard for emergency officers
├── mobile/       → React Native mobile app for citizens
└── backend/      → Express API server for push notifications
```

**Key files to know:**

| File                         | What it does                 |
| ---------------------------- | ---------------------------- |
| `web/app/dashboard/page.tsx` | Main dashboard page          |
| `web/app/reports/page.tsx`   | Incident reports table       |
| `web/app/map/page.tsx`       | Map view with live incidents |

| `mobile/app/(tabs)/home.tsx` | Citizen home feed |
| `mobile/app/(tabs)/report.tsx` | Submit incident report |
| `mobile/app/(tabs)/sos.tsx` | SOS emergency button |

| `web/lib/firebase.ts` | Firebase config (web) |
| `mobile/lib/firebase.ts` | Firebase config (mobile) |
| `backend/server.js` | Push notification API |


