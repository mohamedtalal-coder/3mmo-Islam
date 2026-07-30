"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster 
      position="bottom-left"
      toastOptions={{
        classNames: {
          toast: 'bg-surface border border-primary/5 text-primary font-ui shadow-xl',
          description: 'text-muted',
          actionButton: 'bg-primary text-inverse font-bold',
          cancelButton: 'bg-background text-primary hover:bg-surface',
        }
      }}
    />
  );
}
