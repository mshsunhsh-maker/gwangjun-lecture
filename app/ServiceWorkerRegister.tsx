"use client";

import { useEffect } from "react";

/** 서비스워커를 등록해 PWA 설치/오프라인을 활성화합니다. */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((err) => console.error("[pwa] 서비스워커 등록 실패:", err));
    }
  }, []);

  return null;
}
