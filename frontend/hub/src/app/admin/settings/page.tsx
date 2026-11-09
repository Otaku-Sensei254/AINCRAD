"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminSettingsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin?view=settings");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#030614] text-white flex items-center justify-center font-mono text-xs">
      REDIRECTING TO CITADEL SYSTEM SETTINGS...
    </div>
  );
}
