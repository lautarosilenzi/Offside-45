import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Política de privacidad · 126Goals",
  description: "Qué datos guarda 126Goals, para qué los usa y cómo pedir que los borremos.",
};

// Política de privacidad, en palabras simples (Ley 25.326 de Protección de los Datos Personales, Argentina).
export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="126Goals" title="Privacidad" />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <article className="panel space-y-5 p-6 text-[0.95rem] leading-relaxed text-navy-700">
          <p className="text-sm text-navy-500">Última actualización: octubre de 2026.</p>
          <Block title="Qué datos guardamos">
            Si creás una cuenta: tu nombre, tu usuario, tu correo, el club que elegiste en el Censo del Hincha, los equipos y ligas que seguís y,
            si los cargás, tu año de nacimiento y tu ciudad. Tu contraseña la guarda nuestro proveedor de cuentas de forma cifrada: nosotros no
            la vemos. Si no creás una cuenta, no guardamos datos tuyos: tus preferencias (cuotas, alertas, mi equipo) quedan solo en tu
            navegador.
          </Block>
          <Block title="Para qué los usamos">
            Para que puedas entrar a tu cuenta desde cualquier dispositivo, mostrarte tus equipos y ligas, armar el Censo del Hincha y, si los
            activás, mandarte avisos de tus partidos. El censo es público solo como total por club: nunca mostramos quién es hincha de qué club.
          </Block>
          <Block title="Con quién los compartimos">
            Con nadie. No vendemos ni cedemos tus datos. Se guardan en los servidores de nuestro proveedor de base de datos (Supabase) y la página
            funciona en los servidores de Vercel.
          </Block>
          <Block title="Tus derechos">
            Podés ver, corregir o borrar tus datos cuando quieras: los cambiás en{" "}
            <Link href="/cuenta" className="text-volt-600 underline">
              Mi cuenta
            </Link>{" "}
            o nos pedís que borremos la cuenta desde{" "}
            <Link href="/creditos#contacto" className="text-volt-600 underline">
              Contacto
            </Link>
            . Según la Ley 25.326, podés ejercer el acceso a tus datos en forma gratuita cada seis meses (salvo interés legítimo). La Agencia de
            Acceso a la Información Pública es el órgano de control de la ley y atiende las denuncias y reclamos.
          </Block>
          <Block title="Menores de edad">Si tenés menos de 13 años, pedile a un adulto responsable que te ayude a crear la cuenta.</Block>
        </article>
      </main>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-1 font-display text-xl font-bold uppercase tracking-wide text-navy-950">{title}</h2>
      <p>{children}</p>
    </section>
  );
}
