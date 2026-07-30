"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-lg bg-surface backdrop-blur-xl border-none p-8 shadow-lg rounded-2xl max-h-[90vh] overflow-y-auto hide-scrollbar pointer-events-auto"
            >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-primary">{title}</h2>
              <button
                onClick={onClose}
                className="text-muted hover:text-accent transition-colors rounded-full p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="font-body text-primary">
              {children}
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
