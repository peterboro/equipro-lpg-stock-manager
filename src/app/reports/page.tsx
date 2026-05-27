"use client";

import { Download } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { useStore } from "@/lib/store";
import { computeStats, downloadCsv, money } from "@/lib/utils";
import { sizes } from "@/lib/options";

export default function ReportsPage() {
  const { cylinders, transactions, customers } = useStore();
  const stats = computeStats(cylinders);
  const inventoryValue = cylinders.reduce((sum, cylinder) => sum + cylinder.sellingPrice, 0);
  const sales = transactions.filter((transaction) => transaction.type === "Sale");
  const deliveries = transactions.filter((transaction) => transaction.type === "Delivery");
  const damaged = cylinders.filter((cylinder) => cylinder.condition === "Damaged" || cylinder.condition === "Leaking");
  const missing = cylinders.filter((cylinder) => cylinder.status === "Delivered" || cylinder.location === "Client Site");

  const reportCards = [
    { name: "Daily stock report", value: `${stats.total} cylinders`, rows: cylinders },
    { name: "Weekly stock report", value: `${stats.full} full / ${stats.empty} empty`, rows: cylinders },
    { name: "Monthly stock report", value: `${transactions.length} movements`, rows: transactions },
    { name: "Sales report", value: money(sales.reduce((sum, item) => sum + item.amountPaid, 0)), rows: sales },
    { name: "Delivery report", value: `${deliveries.length} deliveries`, rows: deliveries },
    { name: "Damaged cylinders report", value: `${damaged.length} flagged`, rows: damaged },
    { name: "Missing/unreturned cylinders report", value: `${missing.length} pending`, rows: missing },
    { name: "Inventory value report", value: money(inventoryValue), rows: cylinders }
  ];

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Reports</h1>
        <p className="text-sm text-slate-600">Export stock, sales, delivery, damage, missing-cylinder, and inventory value reports as CSV.</p>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {reportCards.map((report) => (
          <article key={report.name} className="rounded-lg border border-slate-200 bg-white p-3 shadow-soft sm:p-4">
            <h2 className="min-h-10 text-sm font-bold text-charcoal">{report.name}</h2>
            <p className="mt-3 text-2xl font-black">{report.value}</p>
            <button
              className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-petrol hover:bg-petrol/5 sm:w-auto"
              onClick={() => downloadCsv(`${report.name.toLowerCase().replaceAll("/", "-").replaceAll(" ", "-")}.csv`, report.rows as Record<string, string | number | undefined>[])}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <h2 className="text-lg font-bold">Stock by size</h2>
          <div className="mt-4 grid gap-3">
            {sizes.map((size) => {
              const total = cylinders.filter((cylinder) => cylinder.size === size).length;
              const full = cylinders.filter((cylinder) => cylinder.size === size && cylinder.status === "Full").length;
              return (
                <div key={size} className="grid grid-cols-[auto_1fr] items-center gap-2 rounded-md bg-slate-50 px-3 py-3 sm:flex sm:justify-between">
                  <span className="font-bold">{size}</span>
                  <span className="text-right text-sm text-slate-600 sm:text-left">{full} full of {total}</span>
                  <StatusBadge value={full <= 1 ? "Refill Needed" : "Full"} className="col-span-2 w-fit" />
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <h2 className="text-lg font-bold">Outstanding payments</h2>
          <div className="mt-4 grid gap-3 md:hidden">
            {transactions.filter((item) => item.paymentStatus !== "Paid").map((transaction) => {
              const customer = customers.find((item) => item.id === transaction.customerId);
              return (
                <article key={transaction.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-bold">{customer?.fullName ?? "Walk-in"}</h3>
                      <p className="text-sm text-slate-600">{transaction.type}</p>
                    </div>
                    <StatusBadge value={transaction.paymentStatus} />
                  </div>
                  <p className="mt-3 text-sm font-bold">{money(transaction.amountPaid)}</p>
                </article>
              );
            })}
          </div>
          <div className="mt-4 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2">Customer</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.filter((item) => item.paymentStatus !== "Paid").map((transaction) => {
                  const customer = customers.find((item) => item.id === transaction.customerId);
                  return (
                    <tr key={transaction.id}>
                      <td className="py-3">{customer?.fullName ?? "Walk-in"}</td>
                      <td>{transaction.type}</td>
                      <td>{money(transaction.amountPaid)}</td>
                      <td><StatusBadge value={transaction.paymentStatus} /></td>
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
