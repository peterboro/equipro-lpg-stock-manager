"use client";

import { LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, SelectInput, TextInput } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { roles } from "@/lib/options";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/types";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("admin@equipro.co.ke");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Admin");
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const router = useRouter();

  async function handleAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isSupabaseConfigured() || !supabase) {
      toast.success(`Demo login as ${role}. Add Supabase env vars for real auth.`);
      router.replace("/");
      return;
    }

    try {
      setBusy(true);
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone,
              role
            }
          }
        });
        if (error) throw error;
        if (data.user) {
          await supabase.from("users").upsert({
            id: data.user.id,
            full_name: fullName || email,
            phone: phone || null,
            role
          });
        }
        toast.success("Account created. Check email if confirmation is enabled.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Logged in successfully");
      }
      router.replace("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <form onSubmit={handleAuth} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-6">
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-md bg-flame text-xl font-black text-white">E</div>
          <h1 className="text-2xl font-bold text-ink">Equipro LPG Stock Manager</h1>
          <p className="mt-1 text-sm text-slate-600">Sign in with your staff account.</p>
        </div>

        <div className="mb-4 grid grid-cols-2 rounded-md bg-slate-100 p-1 text-sm font-bold">
          <button
            type="button"
            className={mode === "login" ? "rounded-md bg-white px-3 py-2 text-petrol shadow-sm" : "px-3 py-2 text-slate-500"}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === "signup" ? "rounded-md bg-white px-3 py-2 text-petrol shadow-sm" : "px-3 py-2 text-slate-500"}
            onClick={() => setMode("signup")}
          >
            Create account
          </button>
        </div>

        <div className="grid gap-4">
          {mode === "signup" ? (
            <>
              <Field label="Full name">
                <TextInput required value={fullName} onChange={(event) => setFullName(event.target.value)} />
              </Field>
              <Field label="Phone number">
                <TextInput value={phone} onChange={(event) => setPhone(event.target.value)} />
              </Field>
            </>
          ) : null}
          <Field label="Email">
            <TextInput type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </Field>
          <Field label="Password">
            <TextInput type="password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          </Field>
          <Field label="Role">
            <SelectInput value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
              {roles.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </SelectInput>
          </Field>
          <button
            disabled={busy}
            className="mt-2 flex items-center justify-center gap-2 rounded-md bg-petrol px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {mode === "login" ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            {busy ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
          </button>
        </div>
      </form>
    </div>
  );
}
