"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export const TOAST_EVENT = "cs-portal-toast";

export interface ToastEventDetail {
  message: string;
}

export function showToast(message: string): void {
  if (typeof window === "undefined" || !message) return;
  window.dispatchEvent(
    new CustomEvent<ToastEventDetail>(TOAST_EVENT, {
      detail: { message },
    })
  );
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [message, setMessage] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent<ToastEventDetail | string>;
      const nextMessage =
        typeof customEvent.detail === "string"
          ? customEvent.detail
          : customEvent.detail?.message;

      if (!nextMessage) return;

      setMessage(nextMessage);
      setVisible(true);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setVisible(false);
        timerRef.current = null;
      }, 2400);
    };

    window.addEventListener(TOAST_EVENT, handleToast as EventListener);
    return () => {
      window.removeEventListener(TOAST_EVENT, handleToast as EventListener);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <>
      {children}
      <div
        id="toastEl"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={`fixed bottom-20 lg:bottom-5 inset-x-4 sm:inset-x-auto sm:left-5 max-w-[calc(100vw-2rem)] z-[85] px-4 py-2.5 rounded-xl text-[13px] font-bold text-white text-center sm:text-right shadow-lg transition-all duration-200 ${
          visible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none hidden"
        }`}
        style={{ background: "var(--hero-bg)" }}
      >
        {message}
      </div>
    </>
  );
}
