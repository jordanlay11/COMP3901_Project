// Run this script once to create officer accounts in Firebase Authentication.
// After running, officers can log in with these credentials on the web dashboard.
//
// Usage: node createOfficers.js

const admin = require("firebase-admin");
require("dotenv").config();

admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json")),
});

// Add as many officers as you need here
const officers = [
  {
    email: "admin@jdrs.gov.jm",
    password: "Admin1234!",
    name: "Admiral Laylor",
  },
  {
    email: "officer1@jdrs.gov.jm",
    password: "Officer123!",
    name: "Cpl. Williams",
  },
  {
    email: "officer2@jdrs.gov.jm",
    password: "Officer123!",
    name: "Cpl. Davis",
  },
];

async function createOfficers() {
  for (const officer of officers) {
    try {
      const user = await admin.auth().createUser({
        email: officer.email,
        password: officer.password,
        displayName: officer.name,
      });
      console.log(`Created: ${officer.email} (${user.uid})`);
    } catch (err) {
      // If the account already exists, skip it
      if (err.code === "auth/email-already-exists") {
        console.log(`Already exists: ${officer.email}`);
      } else {
        console.error(`Failed to create ${officer.email}:`, err.message);
      }
    }
  }
  console.log("Done.");
  process.exit(0);
}

createOfficers();
