"use client";

import { Plus, ReceiptText } from "lucide-react";
import { useState } from "react";
import { Field, SelectInput, TextArea, TextInput } from "@/components/ui/field";
import { ImageUploader } from "@/components/image-uploader";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { paymentMethods, paymentStatuses, transactionTypes } from "@/lib/options";
import { useStore } from "@/lib/store";
import type { Transaction } from "@/lib/types";
import { money } from "@/lib/utils";

export default function TransactionsPage() {
  const { cylinders, customers, transactions, addTransaction } = useStore();
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Transaction>({
    id: "",
    type: "Sale",
    cylinderId: cylinders[0]?.id ?? "",
    customerId: customers[0]?.id,
    quantity: 1,
    amountPaid: 0,
    paymentStatus: "Paid",
    paymentMethod: "M-Pesa",
    deliveryLocation: "",
    driverName: "",
    date: new Date().toISOString().slice(0, 10),
    notes: ""
  });
  const toast = useToast();

  async function saveTransaction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.cylinderId) {
      toast.error("Select a cylinder");
      return;
    }
    try {
      await addTransaction(form);
      setCreating(false);
      toast.success(`${form.type} recorded and cylinder status updated`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save transaction");
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Sales & Deliveries</h1>
          <p className="text-sm text-slate-600">Record sales, deliveries, returns, refills, and stock adjustments.</p>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-flame px-4 py-2 text-sm font-bold text-white" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          New Transaction
        </button>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <tr>
                <th className="py-2">Type</th>
                <th>Cylinder</th>
                <th>Customer</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Driver</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((transaction) => {
                const cylinder = cylinders.find((item) => item.id === transaction.cylinderId);
                const customer = customers.find((item) => item.id === transaction.customerId);
                return (
                  <tr key={transaction.id}>
                    <td className="py-3 font-semibold">{transaction.type}</td>
                    <td>{cylinder?.cylinderId ?? "N/A"}</td>
                    <td>{customer?.fullName ?? "Walk-in"}</td>
                    <td>{transaction.quantity}</td>
                    <td>{money(transaction.amountPaid)}</td>
                    <td><StatusBadge value={transaction.paymentStatus} /></td>
                    <td>{transaction.driverName || "N/A"}</td>
                    <td>{transaction.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {creating ? (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-ink/50 p-4">
          <form onSubmit={saveTransaction} className="mx-auto grid max-w-4xl gap-5 rounded-lg bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold"><ReceiptText className="h-5 w-5 text-petrol" /> Record Transaction</h2>
              <button type="button" className="text-sm font-bold text-slate-500" onClick={() => setCreating(false)}>Close</button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Transaction type"><SelectInput value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Transaction["type"] })}>{transactionTypes.map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
              <Field label="Cylinder"><SelectInput value={form.cylinderId} onChange={(e) => setForm({ ...form, cylinderId: e.target.value })}>{cylinders.map((item) => <option key={item.id} value={item.id}>{item.cylinderId} - {item.size}</option>)}</SelectInput></Field>
              <Field label="Customer"><SelectInput value={form.customerId ?? ""} onChange={(e) => setForm({ ...form, customerId: e.target.value })}><option value="">Walk-in</option>{customers.map((item) => <option key={item.id} value={item.id}>{item.fullName}</option>)}</SelectInput></Field>
              <Field label="Quantity"><TextInput type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} /></Field>
              <Field label="Amount paid"><TextInput type="number" value={form.amountPaid} onChange={(e) => setForm({ ...form, amountPaid: Number(e.target.value) })} /></Field>
              <Field label="Payment status"><SelectInput value={form.paymentStatus} onChange={(e) => setForm({ ...form, paymentStatus: e.target.value as Transaction["paymentStatus"] })}>{paymentStatuses.map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
              <Field label="Payment method"><SelectInput value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as Transaction["paymentMethod"] })}>{paymentMethods.map((item) => <option key={item}>{item}</option>)}</SelectInput></Field>
              <Field label="Delivery location"><TextInput value={form.deliveryLocation ?? ""} onChange={(e) => setForm({ ...form, deliveryLocation: e.target.value })} /></Field>
              <Field label="Driver name"><TextInput value={form.driverName ?? ""} onChange={(e) => setForm({ ...form, driverName: e.target.value })} /></Field>
              <Field label="Date"><TextInput type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
            </div>
            <Field label="Notes"><TextArea value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
            <div className="grid gap-4 md:grid-cols-2">
              <ImageUploader label="Delivery proof image" bucket="delivery-proofs" value={form.deliveryProofUrl} onChange={(url) => setForm({ ...form, deliveryProofUrl: url })} />
              <ImageUploader label="Receipt image" bucket="receipts" value={form.receiptUrl} onChange={(url) => setForm({ ...form, receiptUrl: url })} />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="rounded-md border border-slate-200 px-4 py-2 text-sm font-bold" onClick={() => setCreating(false)}>Cancel</button>
              <button className="rounded-md bg-petrol px-4 py-2 text-sm font-bold text-white">Save Transaction</button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
