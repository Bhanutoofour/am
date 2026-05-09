"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    $zoho?: any;
  }
}

function isAppleTouchDevice() {
  if (typeof window === "undefined") return false;

  const platform = navigator.platform || "";
  const userAgent = navigator.userAgent || "";
  const isIpadOnDesktopMode =
    platform === "MacIntel" && navigator.maxTouchPoints > 1;

  return /iPad|iPhone|iPod/.test(userAgent) || isIpadOnDesktopMode;
}

export default function ZohoIosChatButton() {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    setShowFallback(isAppleTouchDevice());
  }, []);

  if (!showFallback) return null;

  const startChat = () => {
    const salesiq = window.$zoho?.salesiq;
    if (!salesiq) return;

    try {
      salesiq.visitor?.question?.("Hi, I need help");
      salesiq.chatwindow?.visible?.("show");
      salesiq.chat?.start?.();
    } catch (error) {
      console.warn("Zoho iOS chat fallback failed:", error);
    }
  };

  return (
    <button
      type="button"
      className="zoho-ios-chat-fallback"
      onClick={startChat}
      aria-label="Start live chat"
    >
      Chat
    </button>
  );
}
