"use client";

import { useEffect, useState } from "react";

// Foro del hincha y cuentas: por ahora se guardan en el navegador de cada usuario (localStorage). Cuando se conecte
// Supabase (lib/supabase.ts), estas funciones pasan a leer y escribir en la base compartida sin cambiar las páginas.

export type Profile = {
  username: string; // sin @
  name: string;
  email: string;
  birthYear?: string;
  city?: string;
  clubId: string; // club del fútbol argentino del que es hincha
  createdAt: string;
};

export type Post = {
  id: string;
  topicId: string;
  parentId?: string; // respuesta a otro mensaje
  author: Pick<Profile, "username" | "name" | "clubId">;
  text: string;
  createdAt: string;
  likes: string[]; // usuarios que le dieron me gusta
};

const USER_KEY = "o45-cuenta";
const POSTS_KEY = "o45-foro";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("o45-community"));
  } catch {
    // Navegador sin almacenamiento (modo privado): la página sigue funcionando sin guardar.
  }
}

export const getProfile = () => read<Profile | null>(USER_KEY, null);
export const saveProfile = (p: Profile) => write(USER_KEY, p);
export const signOut = () => {
  try {
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("o45-community"));
  } catch {}
};

export const getPosts = () => read<Post[]>(POSTS_KEY, []);

export function addPost(post: Omit<Post, "id" | "createdAt" | "likes">) {
  const posts = getPosts();
  posts.push({ ...post, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: new Date().toISOString(), likes: [] });
  write(POSTS_KEY, posts);
}

export function toggleLike(postId: string, username: string) {
  const posts = getPosts().map((p) =>
    p.id === postId ? { ...p, likes: p.likes.includes(username) ? p.likes.filter((u) => u !== username) : [...p.likes, username] } : p,
  );
  write(POSTS_KEY, posts);
}

export function deletePost(postId: string) {
  write(
    POSTS_KEY,
    getPosts().filter((p) => p.id !== postId && p.parentId !== postId),
  );
}

export const USERNAME_RE = /^[a-z0-9_]{3,20}$/;
export const MAX_POST = 280;

// Perfil y mensajes actuales; se actualiza cuando cambian (también desde otra pestaña).
export function useCommunity() {
  const [state, setState] = useState<{ ready: boolean; profile: Profile | null; posts: Post[] }>({ ready: false, profile: null, posts: [] });
  useEffect(() => {
    const load = () => setState({ ready: true, profile: getProfile(), posts: getPosts() });
    load();
    window.addEventListener("o45-community", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("o45-community", load);
      window.removeEventListener("storage", load);
    };
  }, []);
  return state;
}
