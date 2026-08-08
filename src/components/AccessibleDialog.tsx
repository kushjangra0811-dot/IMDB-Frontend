'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface AccessibleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function AccessibleDialog({ isOpen, onClose, title, children }: AccessibleDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const dialogNode = dialogRef.current;
    if (isOpen) {
      dialogNode?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialogNode?.close();
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  if (!mounted) return null;

  return (
    <dialog
      ref={dialogRef}
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
      className="backdrop:bg-black/80 backdrop:backdrop-blur-sm bg-transparent p-0 m-auto max-w-5xl w-full rounded-xl shadow-2xl open:animate-in open:fade-in-90 open:zoom-in-95"
      aria-labelledby="dialog-title"
      aria-modal="true"
    >
      <div className="bg-background border border-border text-foreground rounded-xl overflow-hidden shadow-2xl relative">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 id="dialog-title" className="text-xl font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
            aria-label="Close dialog"
            tabIndex={0}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-0">
          {children}
        </div>
      </div>
    </dialog>
  );
}
