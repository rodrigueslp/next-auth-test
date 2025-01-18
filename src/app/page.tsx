import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from 'next/link'; // Adicione esta importação

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1>Olá, {session?.user?.name}!</h1>
        <p>Você está logado com {session?.user?.email}</p>
        <Link href="/api/auth/signout" className="text-blue-500 hover:underline">
          Sair
        </Link>
      </div>
    </main>
  );
}