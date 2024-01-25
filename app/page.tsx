import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-10 p-24">
      <Link href="/en">Show text in English </Link>
      <Link href="/es">Show text in Spanish </Link>
      <Link href="/it">Show text in Italian </Link>
    </main>
  );
}
