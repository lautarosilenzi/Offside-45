"use client";

// Cuentas de 126Goals: perfil (con el club del Censo del Hincha) y favoritos (equipos y ligas).
// - Con Supabase conectado (lib/supabase.ts, variables NEXT_PUBLIC_SUPABASE_*): cuenta real con correo y contraseña,
//   y los datos en la base (supabase/schema.sql y supabase/cuentas.sql).
// - Sin Supabase: todo queda en el navegador (lib/community.ts), como hasta ahora, para que nada se rompa.
import { useCallback, useEffect, useState } from "react";
import { getProfile as getLocalProfile, saveProfile as saveLocalProfile, signOut as localSignOut } from "./community";
import { supabase } from "./supabase";

// Club del Censo del Hincha: cualquier club del mundo, como lo devuelve el buscador.
export type FanClub = { id: string; name: string; logo?: string };

export type Account = {
  name: string;
  username: string;
  email: string;
  birthYear?: string;
  city?: string;
  club: FanClub;
  country?: string; // código de dos letras de la bandera ("ar", "uy"…), para el censo por países
  createdAt: string;
};

export type Favorite = { kind: "team" | "league" | "player"; ref: string; name: string; logo?: string };

export const hasServer = !!supabase;
const FAV_KEY = "o45-favoritos";
const EVENT = "o45-account";

const notify = () => window.dispatchEvent(new Event(EVENT));

function readLocalFavs(): Favorite[] {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) ?? "[]") as Favorite[];
  } catch {
    return [];
  }
}
function writeLocalFavs(f: Favorite[]) {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify(f));
  } catch {}
  notify();
}

// Perfil guardado en el navegador (versión anterior: club del fútbol argentino por id del sitio).
function localAccount(): Account | null {
  const p = getLocalProfile();
  if (!p) return null;
  const club = (p as unknown as { club?: FanClub }).club ?? { id: `site:${p.clubId}`, name: p.clubId };
  return { name: p.name, username: p.username, email: p.email, birthYear: p.birthYear, city: p.city, club, createdAt: p.createdAt };
}

async function serverAccount(): Promise<Account | null> {
  if (!supabase) return null;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", auth.user.id).maybeSingle();
  if (!data) return null;
  return {
    name: data.name,
    username: data.username,
    email: auth.user.email ?? "",
    birthYear: data.birth_year ? String(data.birth_year) : undefined,
    city: data.city ?? undefined,
    club: { id: data.club_id, name: data.club_name ?? data.club_id, logo: data.club_logo ?? undefined },
    country: data.country ? String(data.country).toLowerCase() : undefined,
    createdAt: data.created_at,
  };
}

// La cuenta del visitante (o null) y si ya se sabe.
export function useAccount() {
  const [state, setState] = useState<{ ready: boolean; account: Account | null; loggedIn: boolean }>({ ready: false, account: null, loggedIn: false });
  const load = useCallback(async () => {
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      let account = await serverAccount();
      // Primera vez después de confirmar el correo: el perfil se crea con los datos del alta.
      if (data.user && !account && (await createPendingProfile(data.user.user_metadata))) account = await serverAccount();
      setState({ ready: true, account, loggedIn: !!data.user });
    } else setState({ ready: true, account: localAccount(), loggedIn: !!localAccount() });
  }, []);
  useEffect(() => {
    load();
    window.addEventListener(EVENT, load);
    window.addEventListener("o45-community", load);
    const sub = supabase?.auth.onAuthStateChange(() => load());
    return () => {
      window.removeEventListener(EVENT, load);
      window.removeEventListener("o45-community", load);
      sub?.data.subscription.unsubscribe();
    };
  }, [load]);
  return state;
}

// Crear la cuenta. Con servidor, Supabase manda un correo para confirmarla (según la configuración del proyecto).
export async function signUp(a: Account, password: string): Promise<{ error?: string; confirm?: boolean }> {
  if (!supabase) {
    saveLocalProfile({ name: a.name, username: a.username, email: a.email, birthYear: a.birthYear, city: a.city, clubId: a.club.id.replace(/^site:/, ""), createdAt: a.createdAt, club: a.club } as never);
    notify();
    return {};
  }
  // Los datos del perfil viajan con la cuenta: al confirmar el correo (en cualquier dispositivo) el perfil se crea solo.
  const { data, error } = await supabase.auth.signUp({
    email: a.email,
    password,
    options: { data: { profile: a }, emailRedirectTo: `${window.location.origin}/cuenta` },
  });
  if (error) return { error: translateAuthError(error.message) };
  if (!data.session) {
    // Hay que confirmar el correo: el perfil se crea al primer ingreso (los datos quedan guardados mientras tanto).
    try {
      localStorage.setItem("o45-cuenta-pendiente", JSON.stringify(a));
    } catch {}
    return { confirm: true };
  }
  return saveAccount(a);
}

export async function signIn(email: string, password: string): Promise<{ error?: string }> {
  if (!supabase) return { error: "Las cuentas con contraseña todavía no están activadas." };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: translateAuthError(error.message) };
  // Primer ingreso después de confirmar el correo: se crea el perfil con los datos del alta.
  const { data } = await supabase.auth.getUser();
  if (data.user && !(await serverAccount())) await createPendingProfile(data.user.user_metadata);
  notify();
  return {};
}

// Crea el perfil con los datos guardados en el alta (en la cuenta o, si no, en este navegador). true si lo creó.
let triedPending = false;
async function createPendingProfile(meta: Record<string, unknown> | undefined): Promise<boolean> {
  // Una sola vez por visita: si falla (por ejemplo, el usuario ya existe), se completa a mano en el formulario.
  if (triedPending) return false;
  triedPending = true;
  let pending = meta?.profile as Account | undefined;
  try {
    if (!pending) {
      const raw = localStorage.getItem("o45-cuenta-pendiente");
      if (raw) pending = JSON.parse(raw) as Account;
    }
  } catch {}
  if (!pending?.club || !pending.username) return false;
  const r = await saveAccount(pending);
  if (r.error) return false;
  try {
    localStorage.removeItem("o45-cuenta-pendiente");
  } catch {}
  return true;
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut();
  else localSignOut();
  notify();
}

export async function resetPassword(email: string): Promise<{ error?: string }> {
  if (!supabase) return { error: "Las cuentas con contraseña todavía no están activadas." };
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/cuenta` });
  return error ? { error: translateAuthError(error.message) } : {};
}

// Guardar o actualizar el perfil (y el club del censo).
export async function saveAccount(a: Account): Promise<{ error?: string }> {
  if (!supabase) {
    saveLocalProfile({ name: a.name, username: a.username, email: a.email, birthYear: a.birthYear, city: a.city, clubId: a.club.id.replace(/^site:/, ""), createdAt: a.createdAt, club: a.club } as never);
    notify();
    return {};
  }
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "Tenés que entrar a tu cuenta." };
  const { error } = await supabase.from("profiles").upsert({
    id: auth.user.id,
    name: a.name,
    username: a.username,
    club_id: a.club.id,
    club_name: a.club.name,
    club_logo: a.club.logo ?? null,
    country: a.country ?? "ar",
    city: a.city || null,
    birth_year: a.birthYear ? Number(a.birthYear) : null,
  });
  notify();
  if (error) return { error: /duplicate|unique/i.test(error.message) ? "Ese usuario ya existe: elegí otro." : "No se pudo guardar. Probá de nuevo." };
  return {};
}

// ── Favoritos ────────────────────────────────────────────────────────────────────────────────────────────────────
export function useFavorites() {
  const [favs, setFavs] = useState<Favorite[]>([]);
  const load = useCallback(async () => {
    if (supabase) {
      const { data: auth } = await supabase.auth.getUser();
      if (auth.user) {
        const { data } = await supabase.from("favorites").select("kind, ref, name, logo").order("created_at");
        setFavs((data ?? []) as Favorite[]);
        return;
      }
    }
    setFavs(readLocalFavs());
  }, []);
  useEffect(() => {
    load();
    window.addEventListener(EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, [load]);
  return favs;
}

export async function toggleFavorite(f: Favorite, on: boolean) {
  if (supabase) {
    const { data: auth } = await supabase.auth.getUser();
    if (auth.user) {
      if (on) await supabase.from("favorites").upsert({ user_id: auth.user.id, kind: f.kind, ref: f.ref, name: f.name, logo: f.logo ?? null });
      else await supabase.from("favorites").delete().match({ user_id: auth.user.id, kind: f.kind, ref: f.ref });
      notify();
      return;
    }
  }
  const list = readLocalFavs().filter((x) => !(x.kind === f.kind && x.ref === f.ref));
  writeLocalFavs(on ? [...list, f] : list);
}

// Mensajes de Supabase, en castellano.
function translateAuthError(m: string) {
  if (/invalid login/i.test(m)) return "El correo o la contraseña no coinciden.";
  if (/already registered|already exists/i.test(m)) return "Ya hay una cuenta con ese correo. Probá entrar.";
  if (/password/i.test(m) && /least|short|weak/i.test(m)) return "La contraseña tiene que tener al menos 8 caracteres.";
  if (/email not confirmed/i.test(m)) return "Todavía no confirmaste tu correo: revisá tu casilla.";
  if (/rate limit/i.test(m)) return "Demasiados intentos. Esperá unos minutos.";
  return "No se pudo completar. Probá de nuevo en un rato.";
}
