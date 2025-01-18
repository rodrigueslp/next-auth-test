import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

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
        <a href="/api/auth/signout" className="text-blue-500 hover:underline">
          Sair
        </a>
      </div>
    </main>
  );
}