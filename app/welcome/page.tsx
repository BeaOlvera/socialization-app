"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Welcome page now redirects to the consent flow
export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/consent");
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", background: "#F5F4F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontSize: 14, color: "#6B6B6B" }}>Redirecting...</p>
    </div>
  );
}
