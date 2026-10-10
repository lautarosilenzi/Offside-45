"use client";
/* eslint-disable @next/next/no-img-element -- escudos de ESPN y del sitio */

import Link from "next/link";
import { useEffect, useState } from "react";
import ClubPicker from "@/components/account/ClubPicker";
import FavoriteEditor from "@/components/account/FavoriteEditor";
import FavoriteResults from "@/components/account/FavoriteResults";
import { type Account, type FanClub, hasServer, resetPassword, saveAccount, signIn, signOut, signUp, useAccount, useFavorites } from "@/lib/account";
import { USERNAME_RE } from "@/lib/community";
import { NATIONS } from "@/lib/data/nations";

// Países para el censo: los de las selecciones (sin las que ya no existen), por nombre.
const COUNTRIES = [...new Map(Object.values(NATIONS).filter((n) => !n.flag.startsWith("x-")).map((n) => [n.flag, n.name])).entries()].sort((a, b) => a[1].localeCompare(b[1], "es"));

const EMPTY = { name: "", username: "", email: "", password: "", birthYear: "", city: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const input = "h-12 w-full rounded-xl border-0 bg-white px-3 text-base text-navy-900 outline-none ring-1 ring-navy-200 transition focus:ring-2 focus:ring-volt-500";

// Mi cuenta: crear cuenta (con el Censo del Hincha), entrar, ver el perfil con los favoritos y sus resultados, y
// editar los datos. Con Supabase conectado es una cuenta real (correo y contraseña); si no, se guarda en el navegador.
export default function AccountForm() {
  const { ready, account, loggedIn } = useAccount();
  const [mode, setMode] = useState<"alta" | "entrar" | "editar" | "perfil">("alta");

  useEffect(() => {
    if (ready) setMode(account ? "perfil" : loggedIn ? "editar" : "alta");
  }, [ready, account, loggedIn]);

  if (!ready) return <div className="skeleton h-80 rounded-3xl" />;
  if (mode === "perfil" && account) return <Profile account={account} onEdit={() => setMode("editar")} />;

  return (
    <div className="space-y-4">
      {!account && !loggedIn && hasServer && (
        <div className="grid grid-cols-2 gap-1 rounded-full bg-white p-1 ring-1 ring-navy-100">
          {(["alta", "entrar"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`rounded-full py-2.5 font-display text-base font-bold uppercase tracking-wide transition ${mode === m ? "bg-volt-600 text-white" : "text-navy-700"}`}
            >
              {m === "alta" ? "Crear cuenta" : "Entrar"}
            </button>
          ))}
        </div>
      )}
      {/* key: al pasar de "Crear cuenta" a "Completá tu perfil" el formulario empieza de cero. */}
      {mode === "entrar" ? <SignIn /> : <SignUpForm key={mode} account={account} editing={mode === "editar"} onDone={() => setMode("perfil")} />}
    </div>
  );
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<{ error?: string; ok?: string }>({});
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="panel space-y-4 p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setMsg(await signIn(email.trim(), password));
        setBusy(false);
      }}
    >
      <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-navy-950">Entrar a mi cuenta</h2>
      <Field label="Correo electrónico">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={input} />
      </Field>
      <Field label="Contraseña">
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className={input} />
      </Field>
      {msg.error && <p className="text-sm text-red-500">{msg.error}</p>}
      {msg.ok && <p className="text-sm text-emerald-500">{msg.ok}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={busy} className="btn-primary justify-center px-6 py-2.5 text-lg">
          Entrar
        </button>
        <button
          type="button"
          onClick={async () => {
            if (!EMAIL_RE.test(email.trim())) return setMsg({ error: "Escribí tu correo arriba y tocá de nuevo." });
            const r = await resetPassword(email.trim());
            setMsg(r.error ? r : { ok: "Te mandamos un correo para elegir una contraseña nueva." });
          }}
          className="text-sm text-navy-500 hover:underline"
        >
          Me olvidé la contraseña
        </button>
      </div>
    </form>
  );
}

function SignUpForm({ account, editing, onDone }: { account: Account | null; editing: boolean; onDone: () => void }) {
  const [form, setForm] = useState(EMPTY);
  const [club, setClub] = useState<FanClub | undefined>(account?.club);
  const [country, setCountry] = useState(account?.country ?? "ar");
  const [accept, setAccept] = useState(editing);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ error?: string; ok?: string }>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (account) setForm({ ...EMPTY, name: account.name, username: account.username, email: account.email, birthYear: account.birthYear ?? "", city: account.city ?? "" });
  }, [account]);

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const username = form.username.trim().toLowerCase().replace(/^@/, "");
    if (form.name.trim().length < 2) errs.name = "Poné tu nombre.";
    if (!USERNAME_RE.test(username)) errs.username = "De 3 a 20 caracteres: letras, números o guion bajo.";
    if (!editing && !EMAIL_RE.test(form.email.trim())) errs.email = "El correo no parece válido.";
    if (!editing && hasServer && form.password.length < 8) errs.password = "Al menos 8 caracteres.";
    const year = Number(form.birthYear);
    if (form.birthYear && (!Number.isInteger(year) || year < 1900 || year > new Date().getFullYear())) errs.birthYear = "Año no válido.";
    if (!club) errs.club = "Elegí tu club para el Censo del Hincha.";
    if (!editing && !accept) errs.accept = "Tenés que aceptar la política de privacidad.";
    setErrors(errs);
    if (Object.keys(errs).length || !club) return;
    const a: Account = {
      name: form.name.trim(),
      username,
      email: form.email.trim(),
      birthYear: form.birthYear || undefined,
      city: form.city.trim() || undefined,
      club,
      country,
      createdAt: account?.createdAt ?? new Date().toISOString(),
    };
    setBusy(true);
    const r = editing ? await saveAccount(a) : await signUp(a, form.password);
    setBusy(false);
    if ("confirm" in r && r.confirm) return setMsg({ ok: "¡Listo! Te mandamos un correo: tocá el enlace para confirmar tu cuenta y después entrá con tu correo y contraseña." });
    if (r.error) return setMsg({ error: r.error });
    onDone();
  };

  return (
    <form onSubmit={submit} className="panel space-y-4 p-6" noValidate>
      <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-navy-950">{editing ? (account ? "Mis datos" : "Completá tu perfil") : "Crear cuenta"}</h2>
      {editing && !account && <p className="text-sm text-navy-600">Tu cuenta ya está confirmada. Completá estos datos una sola vez y elegí tu club para el Censo del Hincha.</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre y apellido" error={errors.name}>
          <input value={form.name} onChange={set("name")} autoComplete="name" className={input} />
        </Field>
        <Field label="Usuario" error={errors.username}>
          <input value={form.username} onChange={set("username")} autoComplete="username" placeholder="ej. elhincha10" className={input} />
        </Field>
        {!editing && (
          <Field label="Correo electrónico" error={errors.email}>
            <input type="email" value={form.email} onChange={set("email")} autoComplete="email" className={input} />
          </Field>
        )}
        {!editing && hasServer && (
          <Field label="Contraseña" error={errors.password}>
            <input type="password" value={form.password} onChange={set("password")} autoComplete="new-password" className={input} />
          </Field>
        )}
        <Field label="Año de nacimiento (opcional)" error={errors.birthYear}>
          <input inputMode="numeric" value={form.birthYear} onChange={set("birthYear")} placeholder="ej. 1995" className={input} />
        </Field>
        <Field label="Ciudad (opcional)">
          <input value={form.city} onChange={set("city")} autoComplete="address-level2" className={input} />
        </Field>
        <Field label="País">
          <select value={country} onChange={(e) => setCountry(e.target.value)} className={input}>
            {COUNTRIES.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <ClubPicker value={club} onChange={setClub} error={errors.club} />
      {!editing && (
        <label className="flex items-start gap-3 text-sm text-navy-700">
          <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-volt-600" />
          <span>
            Leí y acepto la{" "}
            <Link href="/privacidad" className="text-volt-600 underline">
              política de privacidad
            </Link>
            .{errors.accept && <span className="block text-red-500">{errors.accept}</span>}
          </span>
        </label>
      )}
      {Object.keys(errors).length > 0 && <p className="text-sm font-semibold text-red-500">Revisá los datos marcados en rojo.</p>}
      {msg.error && <p className="text-sm text-red-500">{msg.error}</p>}
      {msg.ok && <p className="rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">{msg.ok}</p>}
      <button type="submit" disabled={busy} className="btn-primary justify-center px-6 py-2.5 text-lg">
        {editing ? "Guardar" : "Crear mi cuenta"}
      </button>
      {!hasServer && !editing && <p className="text-xs text-navy-500">Por ahora tu cuenta se guarda en este celular o computadora.</p>}
    </form>
  );
}

function Profile({ account, onEdit }: { account: Account; onEdit: () => void }) {
  const favs = useFavorites();
  return (
    <div className="space-y-6">
      <div className="panel overflow-hidden">
        <div className="flex flex-col items-center gap-2 bg-gradient-to-br from-navy-900 to-brand-700 px-6 py-6 text-center text-white">
          {account.club.logo && <img src={account.club.logo} alt="" className="logo-img h-20 w-20 object-contain" />}
          <p className="font-display text-3xl font-bold uppercase tracking-wide">{account.name}</p>
          <p className="text-brand-100">@{account.username}</p>
          <p className="text-sm text-white/90">Hincha de {account.club.name}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 border-t border-navy-100 px-6 py-4">
          <Link href="/censo" className="btn-primary px-5 py-2">
            Ver el Censo del Hincha
          </Link>
          <button type="button" onClick={onEdit} className="rounded-full px-5 py-2 font-display font-bold uppercase tracking-wide text-navy-700 ring-1 ring-navy-200">
            Editar datos
          </button>
          <button type="button" onClick={() => signOut()} className="rounded-full px-4 py-2 text-sm text-navy-500 hover:text-red-500">
            Cerrar sesión
          </button>
        </div>
      </div>

      <section>
        <h2 className="section-title mb-3">Mis favoritos</h2>
        {favs.length === 0 ? (
          <p className="panel px-6 py-8 text-center text-navy-500">Todavía no seguís equipos, ligas ni jugadores. Elegilos abajo, en Personalizá tu página.</p>
        ) : (
          <FavoriteResults favorites={favs} />
        )}
      </section>

      <FavoriteEditor favorites={favs} />
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-semibold text-navy-800">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}
