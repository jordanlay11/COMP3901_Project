- [Node.js](https://nodejs.org) (version 18 or higher) — download and install the LTS version
- [Git](https://git-scm.com/downloads) — for cloning the repository
- [Expo Go](https://expo.dev/go) — **only if** you want to browse the app UI (push notifications won't work in Expo Go)

To check if Node.js is installed, open your terminal and run:

```bash
node --version
```

If you see a version number you're good. If not, install it from the link above.

---

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

A QR code will appear in the terminal. Scan it with the development build app on your phone (see Step 5).

---

## Step 5 — Running the Mobile App on Your Phone

The mobile app requires a **development build** — this is different from the regular Expo Go app.

1. Ask the project lead to send you the **EAS build link** (looks like `https://expo.dev/accounts/jordanlaylor0/...`)
2. Open that link on your **Android phone**
3. Download and install the APK
   - If your phone asks about installing from unknown sources, tap **Allow**
4. Open the installed app on your phone
5. Scan the QR code from Terminal 3 above

> The app will now load and connect to your local dev server. Any code changes you make will update the app automatically.

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

---

## Common Issues

**`npm install` fails**
Make sure you are inside the correct folder (`web`, `mobile`, or `backend`) before running the command.

**Web app shows a blank page or login error**
Your `web/.env.local` file is missing or in the wrong place. It should be directly inside the `/web` folder.

**Mobile app says "Unable to connect"**
Make sure Terminal 3 is running with `--tunnel`. Without the tunnel flag it only works on the same WiFi network.

**Mobile app crashes on open**
Your `mobile/.env` file is missing. Make sure it's inside the `/mobile` folder and contains all the Firebase keys.

**Backend error: "Cannot find serviceAccountKey.json"**
The `serviceAccountKey.json` file needs to be inside the `/backend` folder. Get it from the project lead.

---
