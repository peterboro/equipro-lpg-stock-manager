import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Cylinder, DashboardStats, CylinderSize, StockTakingSession } from "@/lib/types";

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

export function computeStockTakingStats(session: StockTakingSession | null) {
  return session?.items.reduce(
    (current, item) => {
      current.total += item.quantity;
      if (item.status === "Full") current.full += item.quantity;
      if (item.status === "Empty") current.empty += item.quantity;
      return current;
    },
    { total: 0, full: 0, empty: 0 }
  ) ?? null;
}

export function stockTakingCountBySize(session: StockTakingSession | null, size: CylinderSize, status?: "Full" | "Empty") {
  if (!session) return null;
  return session.items
    .filter((item) => item.size === size && (!status || item.status === status))
    .reduce((total, item) => total + item.quantity, 0);
}

export function stockTakingCsvRows(session: StockTakingSession | null) {
  if (!session) return [];
  return session.items.map((item) => ({
    date: session.takenOn,
    frequency: session.frequency,
    source_brand: item.sourceBrand,
    brand: item.brand,
    size: item.size,
    status: item.status,
    quantity: item.quantity,
    condition: item.condition,
    notes: item.notes
  }));
}

export function downloadCsv(filename: string, rows: Record<string, string | number | undefined>[]) {
  const exportRows = rows.length ? rows : [{ message: "No records" }];

  const headers = Array.from(new Set(exportRows.flatMap((row) => Object.keys(row))));
  const csv = [
    headers.join(","),
    ...exportRows.map((row) =>
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
