import { prisma } from "@/lib/prisma";

const HEALTH_LABEL: Record<string, string> = {
  SAUDAVEL: "🟢 Saudável",
  ATENCAO: "🟡 Atenção",
  RISCO_CHURN: "🔴 Risco de churn",
};

export default async function ClientesPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      contracts: { where: { status: "ATIVO" } },
      _count: { select: { projects: true, tickets: true } },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Clientes</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Convertidos automaticamente a partir de leads fechados no pipeline comercial.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Saúde</th>
              <th className="px-4 py-3">Contratos ativos</th>
              <th className="px-4 py-3">Projetos</th>
              <th className="px-4 py-3">Tickets</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="px-4 py-3 font-medium text-zinc-900">{client.name}</td>
                <td className="px-4 py-3">{HEALTH_LABEL[client.health]}</td>
                <td className="px-4 py-3">{client.contracts.length}</td>
                <td className="px-4 py-3">{client._count.projects}</td>
                <td className="px-4 py-3">{client._count.tickets}</td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-400">
                  Nenhum cliente ainda. Feche um lead no pipeline e clique em &quot;Virar cliente&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
