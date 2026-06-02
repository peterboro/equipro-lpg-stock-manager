"use client";

import { AlertTriangle, CheckCircle2, PackageOpen, RefreshCcw } from "lucide-react";
import { Field, SelectInput, TextArea } from "@/components/ui/field";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/lib/store";
import type { CylinderCondition, CylinderStatus } from "@/lib/types";

const actions: { label: string; status: CylinderStatus; condition?: CylinderCondition; icon: typeof RefreshCcw }[] = [
  { label: "Record returned", status: "Returned", icon: RefreshCcw },
  { label: "Mark empty", status: "Empty", icon: PackageOpen },
  { label: "Refill needed", status: "Refill Needed", icon: AlertTriangle },
  { label: "Refilled full", status: "Full", condition: "Good", icon: CheckCircle2 }
];

export default function ReturnsRefillsPage() {
  const { cylinders, updateCylinderStatus } = useStore();
  const toast = useToast();

  async function applyAction(id: string, status: CylinderStatus, condition?: CylinderCondition) {
    try {
      await updateCylinderStatus(id, status, condition ? { condition } : undefined);
      toast.success(`Cylinder marked ${status}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update cylinder");
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Returns & Refills</h1>
        <p className="text-sm text-slate-600">Update returned, empty, refill-needed, refilled, damaged, or leaking cylinders.</p>
      </div>

      <section className="grid gap-4">
        {cylinders.map((cylinder) => (
          <article key={cylinder.id} className="rounded-lg border border-slate-200 bg-white p-3 shadow-soft sm:p-4">
            <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
              <div className="min-w-0">
                <h2 className="text-lg font-bold">{cylinder.cylinderId}</h2>
                <p className="truncate text-sm text-slate-600">{cylinder.brand} {cylinder.size} - {cylinder.serialNumber}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={cylinder.status} />
                <StatusBadge value={cylinder.condition} />
                <StatusBadge value={cylinder.location} />
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-[minmax(160px,0.8fr)_minmax(220px,1fr)] xl:grid-cols-[1fr_1fr_auto]">
              <Field label="Condition">
                <SelectInput
                  value={cylinder.condition}
                  onChange={async (event) => {
                    try {
                      await updateCylinderStatus(cylinder.id, cylinder.status, { condition: event.target.value as CylinderCondition });
                      toast.success("Condition updated");
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : "Could not update condition");
                    }
                  }}
                >
                  {["Good", "Damaged", "Leaking", "Needs Inspection"].map((item) => <option key={item}>{item}</option>)}
                </SelectInput>
              </Field>
              <Field label="Notes">
                <TextArea
                  className="min-h-10"
                  defaultValue={cylinder.notes ?? ""}
                  onBlur={async (event) => {
                    try {
                      await updateCylinderStatus(cylinder.id, cylinder.status, { notes: event.target.value });
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : "Could not update notes");
                    }
                  }}
                />
              </Field>
              <div className="grid grid-cols-2 gap-2 self-end md:col-span-2 xl:col-span-1 xl:grid-cols-4">
                {actions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      className="flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-bold text-charcoal hover:bg-slate-50"
                      onClick={() => applyAction(cylinder.id, action.status, action.condition)}
                    >
                      <Icon className="h-4 w-4 text-petrol" />
                      {action.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
