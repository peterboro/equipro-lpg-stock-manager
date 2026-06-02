"use client";

import { AlertTriangle, Boxes, CircleDollarSign, PackageCheck, PackageOpen, RefreshCcw, Truck } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { useStore } from "@/lib/store";
import { computeStats, computeStockTakingStats, money, stockTakingCountBySize } from "@/lib/utils";
import { sizes } from "@/lib/options";

const statIcons = [Boxes, PackageCheck, PackageOpen, CircleDollarSign, Truck, RefreshCcw, AlertTriangle];

export default function DashboardPage() {
  const { cylinders, transactions, customers, latestStockTaking } = useStore();
  const stats = computeStats(cylinders);
  const snapshotStats = computeStockTakingStats(latestStockTaking);
  const displayStats = {
    total: snapshotStats?.total ?? stats.total,
    full: snapshotStats?.full ?? stats.full,
    empty: snapshotStats?.empty ?? stats.empty
  };
  const statCards = [
    ["Total cylinders", displayStats.total],
    ["Full cylinders", displayStats.full],
    ["Empty cylinders", displayStats.empty],
    ["Sold cylinders", stats.sold],
    ["Delivered cylinders", stats.delivered],
    ["Returned cylinders", stats.returned],
    ["Damaged cylinders", stats.damaged]
  ];

  const lowStock = sizes.map((size) => {
    const snapshotFull = stockTakingCountBySize(latestStockTaking, size, "Full");

    return {
      size,
      full: snapshotFull ?? cylinders.filter((cylinder) => cylinder.size === size && cylinder.status === "Full").length
    };
  });
  const snapshotDate = latestStockTaking
    ? new Intl.DateTimeFormat("en-KE", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(latestStockTaking.takenOn))
    : null;

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-petrol">Equipro Investments (K) Ltd</p>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Dashboard</h1>
          {latestStockTaking ? (
            <p className="mt-1 text-sm text-slate-600">
              Showing latest {latestStockTaking.frequency.toLowerCase()} stock count from {snapshotDate}.
            </p>
          ) : null}
        </div>
        <Link href="/inventory" className="flex min-h-11 w-full items-center justify-center rounded-md bg-flame px-4 py-2 text-sm font-bold text-white sm:w-auto">
          Add Cylinder
        </Link>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(([label, value], index) => {
          const Icon = statIcons[index];
          return (
            <div key={label} className="rounded-lg border border-slate-200 bg-white p-3 shadow-soft sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-2 sm:mb-4">
                <p className="text-xs font-semibold text-slate-500 sm:text-sm">{label}</p>
                <Icon className="h-5 w-5 text-petrol" />
              </div>
              <p className="text-2xl font-black text-ink sm:text-3xl">{value}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.4fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <h2 className="text-lg font-bold">Low stock alerts by size</h2>
          <div className="mt-4 grid gap-3">
            {lowStock.map((item) => (
              <div key={item.size} className="grid grid-cols-[auto_1fr] items-center gap-2 rounded-md bg-slate-50 px-3 py-3 sm:flex sm:justify-between">
                <span className="font-semibold">{item.size}</span>
                <span className="text-right text-sm text-slate-600 sm:text-left">{item.full} full</span>
                <StatusBadge value={item.full <= 1 ? "Refill Needed" : "Full"} className="col-span-2 w-fit" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent transactions</h2>
            <Link href="/transactions" className="text-sm font-bold text-petrol">View all</Link>
          </div>
          <div className="mt-4 grid gap-3 md:hidden">
            {transactions.slice(0, 6).map((transaction) => {
              const customer = customers.find((item) => item.id === transaction.customerId);
              const cylinder = cylinders.find((item) => item.id === transaction.cylinderId);
              return (
                <article key={transaction.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold">{transaction.type}</h3>
                      <p className="truncate text-sm text-slate-600">{customer?.fullName ?? "Walk-in"}</p>
                    </div>
                    <StatusBadge value={transaction.paymentStatus} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-600">{cylinder?.cylinderId ?? "N/A"} - {transaction.date}</span>
                    <span className="font-bold">{money(transaction.amountPaid)}</span>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-4 hidden overflow-x-auto md:block">
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
