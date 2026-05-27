import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Cylinder, DashboardStats } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function money(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0
  }).format(value);
}

export function computeStats(cylinders: Cylinder[]): DashboardStats {
  return {
    total: cylinders.length,
    full: cylinders.filter((cylinder) => cylinder.status === "Full").length,
    empty: cylinders.filter((cylinder) => cylinder.status === "Empty").length,
    sold: cylinders.filter((cylinder) => cylinder.status === "Sold").length,
    delivered: cylinders.filter((cylinder) => cylinder.status === "Delivered").length,
    returned: cylinders.filter((cylinder) => cylinder.status === "Returned").length,
    damaged: cylinders.filter((cylinder) => cylinder.condition === "Damaged" || cylinder.condition === "Leaking").length
  };
}

export function downloadCsv(filename: string, rows: Record<string, string | number | undefined>[]) {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = String(row[header] ?? "");
          return `"${value.replaceAll('"', '""')}"`;
        })
        .join(",")
    )
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
