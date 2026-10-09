import type { Metadata } from "next";
import AccountForm from "@/components/AccountForm";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Mi cuenta · 126Goals" };

export default function AccountPage() {
  return (
    <>
      <PageHero eyebrow="Sumate a 126Goals" title="Mi cuenta">
        Creá tu cuenta, sumate al Censo del Hincha y seguí tus equipos y ligas.
      </PageHero>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <AccountForm />
      </main>
    </>
  );
}
