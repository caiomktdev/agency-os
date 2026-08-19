import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "./actions";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/leads", label: "Comercial (Leads)" },
  { href: "/clientes", label: "Clientes" },
  { href: "/projetos", label: "Projetos" },
  { href: "/atendimento", label: "Atendimento" },
  { href: "/financeiro", label: "Financeiro" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="flex flex-1">
      <aside className="flex w-64 flex-col border-r border-zinc-200 bg-white px-4 py-6">
        <div className="mb-8 px-2">
          <p className="text-lg font-semibold text-zinc-900">Agency OS</p>
          <p className="text-xs text-zinc-500">Hub central da agência</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-zinc-200 pt-4">
          <p className="px-2 text-sm font-medium text-zinc-900">
            {session?.name}
          </p>
          <p className="px-2 text-xs text-zinc-500">{session?.role}</p>
          <form action={logoutAction} className="mt-2">
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              Sair
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto px-8 py-8">{children}</main>
    </div>
  );
}
