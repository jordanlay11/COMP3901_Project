"use client";

// This hook protects pages that require login.
// Import it at the top of any page that officers must be signed in to see.
// If the user is not logged in, it redirects them to the login page automatically.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export function useAuthGuard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged fires whenever the login state changes.
    // If the user is null (not logged in), redirect to login page.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return { loading };
}
