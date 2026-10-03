"use client";

import Link from "next/link";
import { useState } from "react";
import { MAX_POST, type Post, addPost, deletePost, toggleLike, useCommunity } from "@/lib/community";
import { getTeam } from "@/lib/teams";
import Crest from "./Crest";

export type Topic = { id: string; title: string; score: string; competition: string; date: string; homeId: string; awayId: string };

const timeAgo = (iso: string) => {
  const s = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s} s`;
  if (s < 3600) return `${Math.round(s / 60)} min`;
  if (s < 86400) return `${Math.round(s / 3600)} h`;
  return new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "short" });
};

// Debate de cada partido: mensajes ordenados por me gusta, con respuestas.
export default function ForoBoard({ topics }: { topics: Topic[] }) {
  const { ready, profile, posts } = useCommunity();
  const [topicId, setTopicId] = useState(topics[0]?.id);
  const topic = topics.find((t) => t.id === topicId);
  const count = (id: string) => posts.filter((p) => p.topicId === id).length;

  return (
    <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
      <aside className="space-y-2">
        <p className="px-1 font-display text-xs font-semibold uppercase tracking-widest text-navy-500">Partidos</p>
        <ul className="space-y-1.5">
          {topics.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setTopicId(t.id)}
                className={`w-full rounded-2xl px-3 py-2.5 text-left transition ${
                  t.id === topicId ? "bg-[#0a1a3f] text-white shadow-lg" : "bg-white/80 text-navy-900 ring-1 ring-navy-100 hover:bg-white"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Crest team={getTeam(t.homeId)!} size="xs" />
                  <Crest team={getTeam(t.awayId)!} size="xs" />
                  <span className="ml-auto text-[0.7rem] opacity-70">{count(t.id) || ""}</span>
                </span>
                <span className="mt-1 block font-display text-base font-bold uppercase leading-tight tracking-wide">{t.title}</span>
                <span className={`block text-xs ${t.id === topicId ? "text-blue-200" : "text-navy-500"}`}>{t.competition}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="min-w-0">
        {topic && (
          <div className="mb-4 rounded-3xl bg-white/90 p-4 ring-1 ring-navy-100">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">{topic.competition}</p>
            <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-[#0a1a3f]">{topic.title}</h2>
            <p className="text-sm text-navy-600">
              {topic.score} · {topic.date.split("-").reverse().join("/")}
            </p>
          </div>
        )}

        {!ready ? null : profile ? (
          topic && <Composer topicId={topic.id} />
        ) : (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-[#0a1a3f] p-4 text-white">
            <p>Creá tu cuenta y elegí tu club para opinar.</p>
            <Link href="/cuenta" className="rounded-full bg-white px-4 py-2 font-display font-bold uppercase tracking-wide text-[#0a1a3f]">
              Crear cuenta
            </Link>
          </div>
        )}

        {topic && <Thread topicId={topic.id} posts={posts} me={profile?.username} />}

        <p className="mt-6 text-xs text-navy-500">
          Versión de prueba: por ahora los mensajes se guardan solo en este navegador. Cuando conectemos el servidor van a ser
          compartidos entre todos los hinchas.
        </p>
      </section>
    </div>
  );
}

function Composer({ topicId, parentId, onDone }: { topicId: string; parentId?: string; onDone?: () => void }) {
  const { profile } = useCommunity();
  const [text, setText] = useState("");
  if (!profile) return null;
  const left = MAX_POST - text.length;
  const club = getTeam(profile.clubId);
  const send = () => {
    const clean = text.trim();
    if (!clean || left < 0) return;
    addPost({ topicId, parentId, author: { username: profile.username, name: profile.name, clubId: profile.clubId }, text: clean });
    setText("");
    onDone?.();
  };
  return (
    <div className={`flex gap-3 rounded-3xl bg-white p-3 ring-1 ring-navy-100 ${parentId ? "mt-2" : "mb-4"}`}>
      {club && <Crest team={club} size="md" />}
      <div className="min-w-0 flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" && (e.metaKey || e.ctrlKey) ? send() : undefined)}
          rows={parentId ? 2 : 3}
          placeholder={parentId ? "Respondé…" : "¿Qué te pareció el partido?"}
          className="w-full resize-none rounded-2xl border-0 bg-navy-50/60 px-3 py-2 text-[0.95rem] text-navy-900 outline-none ring-1 ring-navy-100 focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-2 flex items-center justify-end gap-3">
          <span className={`text-xs tabular-nums ${left < 0 ? "font-bold text-red-600" : left < 20 ? "text-amber-600" : "text-navy-400"}`}>{left}</span>
          <button
            type="button"
            onClick={send}
            disabled={!text.trim() || left < 0}
            className="rounded-full bg-blue-600 px-5 py-1.5 font-display font-bold uppercase tracking-wide text-white transition hover:bg-blue-700 disabled:opacity-40"
          >
            {parentId ? "Responder" : "Publicar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Thread({ topicId, posts, me }: { topicId: string; posts: Post[]; me?: string }) {
  // Los mensajes con más me gusta, arriba de todo; con igual cantidad, el más nuevo primero.
  const top = posts
    .filter((p) => p.topicId === topicId && !p.parentId)
    .sort((a, b) => b.likes.length - a.likes.length || b.createdAt.localeCompare(a.createdAt));
  if (!top.length)
    return <p className="rounded-3xl bg-white/70 px-4 py-10 text-center text-navy-500 ring-1 ring-navy-100">Todavía no hay mensajes. ¡Sé el primero en opinar!</p>;
  return (
    <ul className="space-y-3">
      {top.map((p) => (
        <PostCard key={p.id} post={p} replies={posts.filter((r) => r.parentId === p.id).sort((a, b) => a.createdAt.localeCompare(b.createdAt))} me={me} />
      ))}
    </ul>
  );
}

function PostCard({ post, replies, me }: { post: Post; replies: Post[]; me?: string }) {
  const [replying, setReplying] = useState(false);
  return (
    <li className="post-card rounded-3xl bg-white p-4 ring-1 ring-navy-100">
      <PostBody post={post} me={me} onReply={me ? () => setReplying((r) => !r) : undefined} />
      {(replies.length > 0 || replying) && (
        <ul className="mt-3 space-y-2 border-l-2 border-blue-100 pl-4">
          {replies.map((r) => (
            <li key={r.id}>
              <PostBody post={r} me={me} />
            </li>
          ))}
          {replying && <Composer topicId={post.topicId} parentId={post.id} onDone={() => setReplying(false)} />}
        </ul>
      )}
    </li>
  );
}

function PostBody({ post, me, onReply }: { post: Post; me?: string; onReply?: () => void }) {
  const club = getTeam(post.author.clubId);
  const liked = !!me && post.likes.includes(me);
  const [pop, setPop] = useState(false);
  return (
    <div className="flex gap-3">
      {club && <Crest team={club} size="sm" />}
      <div className="min-w-0 flex-1">
        <p className="text-sm">
          <span className="font-bold text-navy-950">{post.author.name}</span> <span className="text-navy-400">@{post.author.username}</span>
          <span className="text-navy-400"> · {timeAgo(post.createdAt)}</span>
        </p>
        <p className="mt-0.5 whitespace-pre-wrap break-words text-[0.95rem] text-navy-900">{post.text}</p>
        <div className="mt-2 flex items-center gap-4 text-sm text-navy-500">
          <button
            type="button"
            disabled={!me}
            onClick={() => {
              if (!me) return;
              toggleLike(post.id, me);
              setPop(true);
              setTimeout(() => setPop(false), 400);
            }}
            className={`flex items-center gap-1 transition ${liked ? "text-rose-600" : "hover:text-rose-600"} disabled:cursor-default`}
            aria-pressed={liked}
          >
            <svg viewBox="0 0 24 24" className={`h-4 w-4 ${pop ? "like-pop" : ""}`} fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M12 20.5l-1.3-1.2C5.6 14.7 2.5 11.9 2.5 8.4 2.5 5.6 4.7 3.5 7.4 3.5c1.6 0 3.1.7 4.1 1.9 1-1.2 2.5-1.9 4.1-1.9 2.7 0 4.9 2.1 4.9 4.9 0 3.5-3.1 6.3-8.2 10.9z" />
            </svg>
            <span className="tabular-nums">{post.likes.length}</span>
          </button>
          {onReply && (
            <button type="button" onClick={onReply} className="hover:text-blue-600">
              Responder
            </button>
          )}
          {me === post.author.username && (
            <button type="button" onClick={() => deletePost(post.id)} className="ml-auto text-xs hover:text-red-600">
              Borrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
