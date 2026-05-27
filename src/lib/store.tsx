"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Customer, Cylinder, CylinderStatus, Transaction } from "@/lib/types";
import { seedCustomers, seedCylinders, seedTransactions } from "@/lib/seed-data";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { mapCustomer, mapCylinder, mapTransaction } from "@/lib/supabase/mappers";
import { customerPayload, cylinderPayload, transactionPayload } from "@/lib/supabase/payloads";

type StoreContextValue = {
  cylinders: Cylinder[];
  customers: Customer[];
  transactions: Transaction[];
  loading: boolean;
  usingSupabase: boolean;
  refresh: () => Promise<void>;
  addCylinder: (cylinder: Cylinder) => Promise<void>;
  updateCylinder: (id: string, patch: Partial<Cylinder>) => Promise<void>;
  deleteCylinder: (id: string) => Promise<void>;
  addCustomer: (customer: Customer) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  addTransaction: (transaction: Transaction) => Promise<void>;
  updateCylinderStatus: (id: string, status: CylinderStatus, patch?: Partial<Cylinder>) => Promise<void>;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function statusFromTransaction(type: Transaction["type"]): CylinderStatus | null {
  if (type === "Sale") return "Sold";
  if (type === "Delivery") return "Delivered";
  if (type === "Return") return "Returned";
  if (type === "Refill") return "Full";
  return null;
}

async function requireAuthUser() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cylinders, setCylinders] = useState<Cylinder[]>(seedCylinders);
  const [customers, setCustomers] = useState<Customer[]>(seedCustomers);
  const [transactions, setTransactions] = useState<Transaction[]>(seedTransactions);
  const [loading, setLoading] = useState(false);
  const usingSupabase = isSupabaseConfigured();

  const refresh = useCallback(async () => {
    if (!usingSupabase || !supabase) return;
    setLoading(true);
    try {
      const [cylinderRows, customerRows, transactionRows] = await Promise.all([
        supabase.from("cylinders").select("*").order("created_at", { ascending: false }),
        supabase.from("customers").select("*").order("created_at", { ascending: false }),
        supabase.from("transactions").select("*").order("transaction_date", { ascending: false })
      ]);

      if (cylinderRows.error) throw cylinderRows.error;
      if (customerRows.error) throw customerRows.error;
      if (transactionRows.error) throw transactionRows.error;

      setCylinders(cylinderRows.data.map((row) => mapCylinder(row)));
      setCustomers(customerRows.data.map((row) => mapCustomer(row)));
      setTransactions(transactionRows.data.map((row) => mapTransaction(row)));
    } finally {
      setLoading(false);
    }
  }, [usingSupabase]);

  useEffect(() => {
    refresh().catch(() => setLoading(false));
  }, [refresh]);

  useEffect(() => {
    if (!usingSupabase || !supabase) return;
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        refresh().catch(() => setLoading(false));
      }
      if (event === "SIGNED_OUT") {
        setCylinders(seedCylinders);
        setCustomers(seedCustomers);
        setTransactions(seedTransactions);
      }
    });

    return () => data.subscription.unsubscribe();
  }, [refresh, usingSupabase]);

  const value = useMemo<StoreContextValue>(
    () => ({
      cylinders,
      customers,
      transactions,
      loading,
      usingSupabase,
      refresh,
      addCylinder: async (cylinder) => {
        if (usingSupabase && supabase) {
          const user = await requireAuthUser();
          const { data, error } = await supabase
            .from("cylinders")
            .insert({ ...cylinderPayload(cylinder), created_by: user?.id ?? null })
            .select("*")
            .single();
          if (error) throw error;
          setCylinders((current) => [mapCylinder(data), ...current]);
          return;
        }
        setCylinders((current) => [{ ...cylinder, id: crypto.randomUUID() }, ...current]);
      },
      updateCylinder: async (id, patch) => {
        if (usingSupabase && supabase) {
          const { data, error } = await supabase
            .from("cylinders")
            .update(cylinderPayload(patch))
            .eq("id", id)
            .select("*")
            .single();
          if (error) throw error;
          setCylinders((current) => current.map((cylinder) => (cylinder.id === id ? mapCylinder(data) : cylinder)));
          return;
        }
        setCylinders((current) =>
          current.map((cylinder) =>
            cylinder.id === id ? { ...cylinder, ...patch, lastUpdated: new Date().toISOString().slice(0, 10) } : cylinder
          )
        );
      },
      deleteCylinder: async (id) => {
        if (usingSupabase && supabase) {
          const { error } = await supabase.from("cylinders").delete().eq("id", id);
          if (error) throw error;
        }
        setCylinders((current) => current.filter((cylinder) => cylinder.id !== id));
      },
      addCustomer: async (customer) => {
        if (usingSupabase && supabase) {
          const { data, error } = await supabase.from("customers").insert(customerPayload(customer)).select("*").single();
          if (error) throw error;
          setCustomers((current) => [mapCustomer(data), ...current]);
          return;
        }
        setCustomers((current) => [{ ...customer, id: crypto.randomUUID() }, ...current]);
      },
      deleteCustomer: async (id) => {
        if (usingSupabase && supabase) {
          const { error } = await supabase.from("customers").delete().eq("id", id);
          if (error) throw error;
        }
        setCustomers((current) => current.filter((customer) => customer.id !== id));
      },
      addTransaction: async (transaction) => {
        if (usingSupabase && supabase) {
          const user = await requireAuthUser();
          const { data, error } = await supabase
            .from("transactions")
            .insert({ ...transactionPayload(transaction), created_by: user?.id ?? null })
            .select("*")
            .single();
          if (error) throw error;

          setTransactions((current) => [mapTransaction(data), ...current]);
          const { data: cylinderRow } = await supabase.from("cylinders").select("*").eq("id", transaction.cylinderId).single();
          if (cylinderRow) {
            setCylinders((current) =>
              current.map((cylinder) => (cylinder.id === transaction.cylinderId ? mapCylinder(cylinderRow) : cylinder))
            );
          }
          return;
        }

        setTransactions((current) => [{ ...transaction, id: crypto.randomUUID() }, ...current]);
        const nextStatus = statusFromTransaction(transaction.type);
        if (nextStatus) {
          setCylinders((current) =>
            current.map((cylinder) =>
              cylinder.id === transaction.cylinderId
                ? { ...cylinder, status: nextStatus, lastUpdated: new Date().toISOString().slice(0, 10) }
                : cylinder
            )
          );
        }
      },
      updateCylinderStatus: async (id, status, patch) => {
        const previous = cylinders.find((cylinder) => cylinder.id === id);
        if (usingSupabase && supabase) {
          const user = await requireAuthUser();
          const { data, error } = await supabase
            .from("cylinders")
            .update(cylinderPayload({ ...patch, status }))
            .eq("id", id)
            .select("*")
            .single();
          if (error) throw error;
          await supabase.from("stock_adjustments").insert({
            cylinder_id: id,
            previous_status: previous?.status ?? null,
            new_status: status,
            previous_condition: previous?.condition ?? null,
            new_condition: patch?.condition ?? previous?.condition ?? null,
            reason: patch?.notes || `Marked ${status}`,
            adjusted_by: user?.id ?? null
          });
          setCylinders((current) => current.map((cylinder) => (cylinder.id === id ? mapCylinder(data) : cylinder)));
          return;
        }
        setCylinders((current) =>
          current.map((cylinder) =>
            cylinder.id === id
              ? { ...cylinder, ...patch, status, lastUpdated: new Date().toISOString().slice(0, 10) }
              : cylinder
          )
        );
      }
    }),
    [cylinders, customers, loading, refresh, transactions, usingSupabase]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}
