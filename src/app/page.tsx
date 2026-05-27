"use client";

import { AlertTriangle, Boxes, CircleDollarSign, PackageCheck, PackageOpen, RefreshCcw, Truck } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { useStore } from "@/lib/store";
import { computeStats, money } from "@/lib/utils";
import { sizes } from "@/lib/options";

const statIcons = [Boxes, PackageCheck, PackageOpen, CircleDollarSign, Truck, RefreshCcw, AlertTriangle];

export default function DashboardPage() {
  const { cylinders, transactions, customers } = useStore();
  const stats = computeStats(cylinders);
  const statCards = [
    ["Total cylinders", stats.total],
    ["Full cylinders", stats.full],
    ["Empty cylinders", stats.empty],
    ["Sold cylinders", stats.sold],
    ["Delivered cylinders", stats.delivered],
    ["Returned cylinders", stats.returned],
    ["Damaged cylinders", stats.damaged]
  ];

  const lowStock = sizes.map((size) => ({
    size,
    full: cylinders.filter((cylinder) => cylinder.size === size && cylinder.status === "Full").length
  }));

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-petrol">Equipro Investments (K) Ltd</p>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Dashboard</h1>
        </div>
        <Link href="/inventory" className="rounded-md bg-flame px-4 py-2 text-sm font-bold text-white">
          Add Cylinder
        </Link>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(([label, value], index) => {
          const Icon = statIcons[index];
          return (
            <div key={label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">{label}</p>
                <Icon className="h-5 w-5 text-petrol" />
              </div>
              <p className="text-3xl font-black text-ink">{value}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.4fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <h2 className="text-lg font-bold">Low stock alerts by size</h2>
          <div className="mt-4 grid gap-3">
            {lowStock.map((item) => (
              <div key={item.size} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-3">
                <span className="font-semibold">{item.size}</span>
                <StatusBadge value={item.full <= 1 ? "Refill Needed" : "Full"} />
                <span className="text-sm text-slate-600">{item.full} full</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent transactions</h2>
            <Link href="/transactions" className="text-sm font-bold text-petrol">View all</Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2">Type</th>
                  <th>Customer</th>
                  <th>Cylinder</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.slice(0, 6).map((transaction) => {
                  const customer = customers.find((item) => item.id === transaction.customerId);
                  const cylinder = cylinders.find((item) => item.id === transaction.cylinderId);
                  return (
                    <tr key={transaction.id}>
                      <td className="py-3 font-semibold">{transaction.type}</td>
                      <td>{customer?.fullName ?? "Walk-in"}</td>
                      <td>{cylinder?.cylinderId ?? "N/A"}</td>
                      <td>{money(transaction.amountPaid)}</td>
                      <td><StatusBadge value={transaction.paymentStatus} /></td>
                      <td>{transaction.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
