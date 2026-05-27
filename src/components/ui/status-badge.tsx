import { cn } from "@/lib/utils";

const toneMap: Record<string, string> = {
  Full: "bg-leaf/10 text-leaf ring-leaf/20",
  Good: "bg-leaf/10 text-leaf ring-leaf/20",
  Paid: "bg-leaf/10 text-leaf ring-leaf/20",
  Empty: "bg-amberline/15 text-[#7a5308] ring-amberline/30",
  Partial: "bg-amberline/15 text-[#7a5308] ring-amberline/30",
  "Refill Needed": "bg-amberline/15 text-[#7a5308] ring-amberline/30",
  Sold: "bg-petrol/10 text-petrol ring-petrol/20",
  Delivered: "bg-petrol/10 text-petrol ring-petrol/20",
  Returned: "bg-slate-100 text-slate-700 ring-slate-200",
  "In Store": "bg-slate-100 text-slate-700 ring-slate-200",
  Damaged: "bg-flame/10 text-flame ring-flame/20",
  Leaking: "bg-flame/10 text-flame ring-flame/20",
  "Needs Inspection": "bg-flame/10 text-flame ring-flame/20",
  Unpaid: "bg-flame/10 text-flame ring-flame/20"
};

export function StatusBadge({ value, className }: { value: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        toneMap[value] ?? "bg-slate-100 text-slate-700 ring-slate-200",
        className
      )}
    >
      {value}
    </span>
  );
}
