"use client";

import { Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Field, TextArea, TextInput } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/lib/store";
import type { Customer } from "@/lib/types";

const emptyCustomer: Customer = {
  id: "",
  fullName: "",
  phone: "",
  email: "",
  location: "",
  deliveryAddress: "",
  notes: ""
};

export default function CustomersPage() {
  const { customers, addCustomer, deleteCustomer } = useStore();
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState<Customer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const toast = useToast();

  const filtered = useMemo(
    () => customers.filter((customer) => `${customer.fullName} ${customer.phone} ${customer.location}`.toLowerCase().includes(query.toLowerCase())),
    [customers, query]
  );

  async function saveCustomer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!creating?.fullName || !creating.phone) {
      toast.error("Customer name and phone are required");
      return;
    }
    try {
      await addCustomer(creating);
      setCreating(null);
      toast.success("Customer added");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save customer");
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Customers</h1>
          <p className="text-sm text-slate-600">Manage delivery addresses and customer contact details.</p>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-flame px-4 py-2 text-sm font-bold text-white" onClick={() => setCreating(emptyCustomer)}>
          <Plus className="h-4 w-4" />
          Add Customer
        </button>
      </div>
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <TextInput className="pl-9" placeholder="Search customer name, phone, or location" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((customer) => (
            <article key={customer.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold">{customer.fullName}</h2>
                  <p className="text-sm text-slate-600">{customer.phone}</p>
                </div>
                <button className="rounded-md p-2 text-flame hover:bg-flame/10" onClick={() => setDeleteId(customer.id)} aria-label="Delete customer">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <dl className="mt-4 grid gap-2 text-sm">
                <div><dt className="font-semibold text-slate-500">Email</dt><dd>{customer.email || "Not provided"}</dd></div>
                <div><dt className="font-semibold text-slate-500">Location</dt><dd>{customer.location}</dd></div>
                <div><dt className="font-semibold text-slate-500">Delivery address</dt><dd>{customer.deliveryAddress}</dd></div>
                <div><dt className="font-semibold text-slate-500">Notes</dt><dd>{customer.notes || "None"}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      {creating ? (
        <div className="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-ink/50 p-4">
          <form onSubmit={saveCustomer} className="grid w-full max-w-2xl gap-4 rounded-lg bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Add Customer</h2>
              <button type="button" className="text-sm font-bold text-slate-500" onClick={() => setCreating(null)}>Close</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full name"><TextInput value={creating.fullName} onChange={(e) => setCreating({ ...creating, fullName: e.target.value })} /></Field>
              <Field label="Phone number"><TextInput value={creating.phone} onChange={(e) => setCreating({ ...creating, phone: e.target.value })} /></Field>
              <Field label="Email"><TextInput type="email" value={creating.email} onChange={(e) => setCreating({ ...creating, email: e.target.value })} /></Field>
              <Field label="Location"><TextInput value={creating.location} onChange={(e) => setCreating({ ...creating, location: e.target.value })} /></Field>
            </div>
            <Field label="Delivery address"><TextInput value={creating.deliveryAddress} onChange={(e) => setCreating({ ...creating, deliveryAddress: e.target.value })} /></Field>
            <Field label="Notes"><TextArea value={creating.notes} onChange={(e) => setCreating({ ...creating, notes: e.target.value })} /></Field>
            <div className="flex justify-end gap-2">
              <button type="button" className="rounded-md border border-slate-200 px-4 py-2 text-sm font-bold" onClick={() => setCreating(null)}>Cancel</button>
              <button className="rounded-md bg-petrol px-4 py-2 text-sm font-bold text-white">Save Customer</button>
            </div>
          </form>
        </div>
      ) : null}

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete customer"
        message="This removes the customer from the local list."
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          try {
            if (deleteId) await deleteCustomer(deleteId);
            setDeleteId(null);
            toast.success("Customer deleted");
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Could not delete customer");
          }
        }}
      />
    </div>
  );
}
