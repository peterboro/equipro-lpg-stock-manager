"use client";

import { AlertTriangle } from "lucide-react";

type ConfirmModalProps = {
  title: string;
  message: string;
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmModal({ title, message, open, onCancel, onConfirm }: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-ink/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-soft">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-flame/10 p-2 text-flame">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-ink">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{message}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-charcoal" onClick={onCancel}>
            Cancel
          </button>
          <button className="rounded-md bg-flame px-4 py-2 text-sm font-semibold text-white" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
