"use client";

import Image from "next/image";
import { Edit3, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Field, SelectInput, TextArea, TextInput } from "@/components/ui/field";
import { ImageUploader } from "@/components/image-uploader";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { brands, conditions, locations, sizes, statuses } from "@/lib/options";
import { useStore } from "@/lib/store";
import type { Cylinder } from "@/lib/types";
import { money } from "@/lib/utils";

const emptyCylinder: Cylinder = {
  id: "",
  cylinderId: "",
  serialNumber: "",
  brand: "Total",
  size: "13kg",
  status: "Full",
  condition: "Good",
  location: "Store",
  buyingPrice: 0,
  sellingPrice: 0,
  dateAdded: new Date().toISOString().slice(0, 10),
  lastUpdated: new Date().toISOString().slice(0, 10),
  notes: ""
};

export default function InventoryPage() {
  const { cylinders, addCylinder, updateCylinder, deleteCylinder } = useStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [size, setSize] = useState("All");
  const [editing, setEditing] = useState<Cylinder | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const toast = useToast();

  const filtered = useMemo(
    () =>
      cylinders.filter((cylinder) => {
        const text = `${cylinder.cylinderId} ${cylinder.serialNumber} ${cylinder.brand}`.toLowerCase();
        return text.includes(query.toLowerCase()) && (status === "All" || cylinder.status === status) && (size === "All" || cylinder.size === size);
      }),
    [cylinders, query, size, status]
  );

  async function saveCylinder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    if (!editing.cylinderId || !editing.serialNumber) {
      toast.error("Cylinder ID and serial number are required");
      return;
    }
    try {
      if (editing.id) {
        await updateCylinder(editing.id, editing);
        toast.success("Cylinder updated");
      } else {
        await addCylinder(editing);
        toast.success("Cylinder added");
      }
      setEditing(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save cylinder");
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Cylinder Inventory</h1>
          <p className="text-sm text-slate-600">Track LPG cylinders by brand, size, status, location, condition, and images.</p>
        </div>
        <button className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-flame px-4 py-2 text-sm font-bold text-white sm:w-auto" onClick={() => setEditing(emptyCylinder)}>
          <Plus className="h-4 w-4" />
          Add Cylinder
        </button>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-soft sm:p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_160px]">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <TextInput className="pl-9" placeholder="Search cylinder ID, serial number, or brand" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <SelectInput value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>All</option>
            {statuses.map((item) => <option key={item}>{item}</option>)}
          </SelectInput>
          <SelectInput value={size} onChange={(event) => setSize(event.target.value)}>
            <option>All</option>
            {sizes.map((item) => <option key={item}>{item}</option>)}
          </SelectInput>
        </div>
        <div className="mt-4 grid gap-3 md:hidden">
          {filtered.map((cylinder) => (
            <article key={cylinder.id} className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-slate-100">
                  {cylinder.mainImageUrl ? <Image src={cylinder.mainImageUrl} alt={cylinder.cylinderId} fill className="object-cover" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="truncate font-bold">{cylinder.cylinderId}</h2>
                      <p className="truncate text-xs text-slate-500">{cylinder.serialNumber}</p>
                    </div>
                    <p className="shrink-0 text-sm font-black text-ink">{money(cylinder.sellingPrice)}</p>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{cylinder.brand} • {cylinder.size} • {cylinder.location}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <StatusBadge value={cylinder.status} />
                    <StatusBadge value={cylinder.condition} />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-xs font-semibold text-slate-500">Updated {cylinder.lastUpdated}</span>
                <div className="flex gap-1">
                  <button className="rounded-md p-2 text-petrol hover:bg-petrol/10" onClick={() => setEditing(cylinder)} aria-label="Edit cylinder">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button className="rounded-md p-2 text-flame hover:bg-flame/10" onClick={() => setDeleteId(cylinder.id)} aria-label="Delete cylinder">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-4 hidden overflow-x-auto md:block">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <tr>
                <th className="py-2">Image</th>
                <th>Cylinder</th>
                <th>Brand</th>
                <th>Size</th>
                <th>Status</th>
                <th>Condition</th>
                <th>Location</th>
                <th>Price</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((cylinder) => (
                <tr key={cylinder.id}>
                  <td className="py-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-md bg-slate-100">
                      {cylinder.mainImageUrl ? <Image src={cylinder.mainImageUrl} alt={cylinder.cylinderId} fill className="object-cover" /> : null}
                    </div>
                  </td>
                  <td>
                    <p className="font-bold">{cylinder.cylinderId}</p>
                    <p className="text-xs text-slate-500">{cylinder.serialNumber}</p>
                  </td>
                  <td>{cylinder.brand}</td>
                  <td>{cylinder.size}</td>
                  <td><StatusBadge value={cylinder.status} /></td>
                  <td><StatusBadge value={cylinder.condition} /></td>
                  <td>{cylinder.location}</td>
                  <td>{money(cylinder.sellingPrice)}</td>
                  <td>{cylinder.lastUpdated}</td>
                  <td className="flex justify-end gap-1 py-3">
                    <button className="rounded-md p-2 text-petrol hover:bg-petrol/10" onClick={() => setEditing(cylinder)} aria-label="Edit cylinder">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button className="rounded-md p-2 text-flame hover:bg-flame/10" onClick={() => setDeleteId(cylinder.id)} aria-label="Delete cylinder">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {editing ? (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-ink/50 p-2 sm:p-4">
          <form onSubmit={saveCylinder} className="mx-auto grid min-h-[calc(100vh-1rem)] max-w-5xl gap-4 rounded-lg bg-white p-4 shadow-soft sm:min-h-0 sm:gap-5 sm:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold sm:text-xl">{editing.id ? "Edit Cylinder" : "Add Cylinder"}</h2>
              <button type="button" className="min-h-10 rounded-md px-3 text-sm font-bold text-slate-500" onClick={() => setEditing(null)}>Close</button>
            </div>
            <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
              <Field label="Cylinder ID"><TextInput value={editing.cylinderId} onChange={(e) => setEditing({ ...editing, cylinderId: e.target.value })} /></Field>
              <Field label="Serial number"><TextInput value={editing.serialNumber} onChange={(e) => setEditing({ ...editing, serialNumber: e.target.value })} /></Field>
              <Field label="Brand"><SelectInput value={editing.brand} onChange={(e) => setEditing({ ...editing, brand: e.target.value as Cylinder["brand"] })}>{brands.map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
              <Field label="Size"><SelectInput value={editing.size} onChange={(e) => setEditing({ ...editing, size: e.target.value as Cylinder["size"] })}>{sizes.map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
              <Field label="Status"><SelectInput value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as Cylinder["status"] })}>{statuses.map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
              <Field label="Condition"><SelectInput value={editing.condition} onChange={(e) => setEditing({ ...editing, condition: e.target.value as Cylinder["condition"] })}>{conditions.map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
              <Field label="Location"><SelectInput value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value as Cylinder["location"] })}>{locations.map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
              <Field label="Buying price"><TextInput type="number" value={editing.buyingPrice} onChange={(e) => setEditing({ ...editing, buyingPrice: Number(e.target.value) })} /></Field>
              <Field label="Selling price"><TextInput type="number" value={editing.sellingPrice} onChange={(e) => setEditing({ ...editing, sellingPrice: Number(e.target.value) })} /></Field>
            </div>
            <Field label="Notes"><TextArea value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /></Field>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              <ImageUploader label="Main cylinder image" bucket="cylinder-images" value={editing.mainImageUrl} onChange={(url) => setEditing({ ...editing, mainImageUrl: url })} />
              <ImageUploader label="Damage image" bucket="damage-reports" value={editing.damageImageUrl} onChange={(url) => setEditing({ ...editing, damageImageUrl: url })} />
              <ImageUploader label="Delivery proof" bucket="delivery-proofs" value={editing.deliveryProofUrl} onChange={(url) => setEditing({ ...editing, deliveryProofUrl: url })} />
              <ImageUploader label="Receipt image" bucket="receipts" value={editing.receiptUrl} onChange={(url) => setEditing({ ...editing, receiptUrl: url })} />
            </div>
            <div className="sticky bottom-0 -mx-4 mt-auto flex gap-2 border-t border-slate-100 bg-white p-4 sm:static sm:mx-0 sm:justify-end sm:border-0 sm:p-0">
              <button type="button" className="min-h-11 flex-1 rounded-md border border-slate-200 px-4 py-2 text-sm font-bold sm:flex-none" onClick={() => setEditing(null)}>Cancel</button>
              <button className="min-h-11 flex-1 rounded-md bg-petrol px-4 py-2 text-sm font-bold text-white sm:flex-none">Save Cylinder</button>
            </div>
          </form>
        </div>
      ) : null}

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete cylinder"
        message="This removes the cylinder from the inventory list. Continue?"
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          try {
            if (deleteId) await deleteCylinder(deleteId);
            setDeleteId(null);
            toast.success("Cylinder deleted");
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Could not delete cylinder");
          }
        }}
      />
    </div>
  );
}
