"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { type Profile, USERNAME_RE, saveProfile, signOut, useCommunity } from "@/lib/community";
import { getTeam } from "@/lib/teams";
import Crest from "./Crest";

type Option = { id: string; name: string };

const EMPTY = { name: "", username: "", email: "", birthYear: "", city: "", clubId: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Alta y edición del perfil. Por ahora se guarda en el navegador (ver lib/community.ts); la contraseña y el ingreso desde
// otros dispositivos llegan cuando se conecte el servidor.
export default function AccountForm({ primera, otros }: { primera: Option[]; otros: Option[] }) {
  const { ready, profile } = useCommunity();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) setForm({ ...EMPTY, ...profile, birthYear: profile.birthYear ?? "", city: profile.city ?? "" });
  }, [profile]);

  if (!ready) return null;

  if (profile && !editing) {
    const club = getTeam(profile.clubId);
    return (
      <div className="panel overflow-hidden">
        <div className="flex items-center gap-4 bg-gradient-to-r from-navy-900 to-brand-700 px-6 py-6 text-white">
          {club && <Crest team={club} size="xl" />}
          <div>
            <p className="font-display text-3xl font-bold uppercase tracking-wide">{profile.name}</p>
            <p className="text-brand-100">@{profile.username}</p>
            {club && <p className="mt-1 text-sm text-white/90">Hincha de {club.name}</p>}
          </div>
        </div>
        {saved && <p className="bg-emerald-50 px-6 py-2 text-sm text-emerald-700">¡Listo! Tu cuenta quedó guardada.</p>}
        <dl className="grid gap-3 px-6 py-5 text-sm sm:grid-cols-2">
          <Item label="Correo" value={profile.email} />
          <Item label="Año de nacimiento" value={profile.birthYear || "—"} />
          <Item label="Ciudad" value={profile.city || "—"} />
          <Item label="Miembro desde" value={new Date(profile.createdAt).toLocaleDateString("es-AR")} />
        </dl>
        <div className="flex flex-wrap gap-2 border-t border-navy-100 px-6 py-4">
          <Link href="/foro" className="rounded-full bg-blue-600 px-5 py-2 font-display font-bold uppercase tracking-wide text-white">
            Ir al foro
          </Link>
          <button type="button" onClick={() => setEditing(true)} className="rounded-full px-5 py-2 font-display font-bold uppercase tracking-wide text-navy-700 ring-1 ring-navy-200">
            Editar datos
          </button>
          <button type="button" onClick={signOut} className="ml-auto rounded-full px-4 py-2 text-sm text-navy-500 hover:text-red-600">
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const username = form.username.trim().toLowerCase().replace(/^@/, "");
    if (form.name.trim().length < 2) errs.name = "Poné tu nombre.";
    if (!USERNAME_RE.test(username)) errs.username = "De 3 a 20 caracteres: letras, números o guion bajo.";
    if (!EMAIL_RE.test(form.email.trim())) errs.email = "El correo no parece válido.";
    const year = Number(form.birthYear);
    if (form.birthYear && (!Number.isInteger(year) || year < 1900 || year > new Date().getFullYear())) errs.birthYear = "Año no válido.";
    if (!form.clubId) errs.clubId = "Elegí tu club.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const p: Profile = {
      name: form.name.trim(),
      username,
      email: form.email.trim(),
      birthYear: form.birthYear || undefined,
      city: form.city.trim() || undefined,
      clubId: form.clubId,
      createdAt: profile?.createdAt ?? new Date().toISOString(),
    };
    saveProfile(p);
    setEditing(false);
    setSaved(true);
  };

  const club = form.clubId ? getTeam(form.clubId) : undefined;
  const input =
    "w-full rounded-xl border-0 bg-white px-3 py-2 text-navy-900 outline-none ring-1 ring-navy-200 transition focus:ring-2 focus:ring-blue-500";

  return (
    <form onSubmit={submit} className="panel space-y-4 p-6" noValidate>
      <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-navy-950">{profile ? "Editar mis datos" : "Crear cuenta"}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre y apellido" error={errors.name}>
          <input value={form.name} onChange={set("name")} autoComplete="name" className={input} />
        </Field>
        <Field label="Usuario" error={errors.username}>
          <input value={form.username} onChange={set("username")} autoComplete="username" placeholder="ej. elhincha10" className={input} />
        </Field>
        <Field label="Correo electrónico" error={errors.email}>
          <input type="email" value={form.email} onChange={set("email")} autoComplete="email" className={input} />
        </Field>
        <Field label="Año de nacimiento (opcional)" error={errors.birthYear}>
          <input inputMode="numeric" value={form.birthYear} onChange={set("birthYear")} placeholder="ej. 1995" className={input} />
        </Field>
        <Field label="Ciudad (opcional)">
          <input value={form.city} onChange={set("city")} autoComplete="address-level2" className={input} />
        </Field>
        <Field label="¿De qué club sos hincha?" error={errors.clubId}>
          <span className="flex items-center gap-2">
            {club && <Crest team={club} size="sm" />}
            <select value={form.clubId} onChange={set("clubId")} className={input}>
              <option value="">Elegí tu club…</option>
              <optgroup label="Primera División (hoy)">
                {primera.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Otros clubes argentinos">
                {otros.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </span>
        </Field>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="shine rounded-full bg-blue-600 px-6 py-2.5 font-display text-lg font-bold uppercase tracking-wide text-white shadow">
          {profile ? "Guardar" : "Crear mi cuenta"}
        </button>
        {profile && (
          <button type="button" onClick={() => setEditing(false)} className="text-sm text-navy-500 hover:underline">
            Cancelar
          </button>
        )}
      </div>
      <p className="text-xs text-navy-500">
        Versión de prueba: tus datos se guardan solo en este navegador y no se envían a ningún lado. Cuando conectemos el servidor vas a
        poder entrar con contraseña desde cualquier dispositivo.
      </p>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-semibold text-navy-800">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-navy-400">{label}</dt>
      <dd className="font-medium text-navy-900">{value}</dd>
    </div>
  );
}
