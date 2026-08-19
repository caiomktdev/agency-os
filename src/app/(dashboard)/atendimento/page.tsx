import { prisma } from "@/lib/prisma";

const STATUS_LABEL: Record<string, string> = {
  ABERTO: "Aberto",
  EM_ATENDIMENTO: "Em atendimento",
  RESOLVIDO: "Resolvido",
};

export default async function AtendimentoPage() {
  const tickets = await prisma.communicationTicket.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: true, assignee: true },
    take: 50,
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Atendimento</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Fluxo unificado de tickets. SLA por prioridade: urgente 1h · padrão 4h úteis · baixa 24h.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Canal</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Responsável</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {tickets.map((t) => (
              <tr key={t.id}>
                <td className="px-4 py-3 font-medium text-zinc-900">{t.client.name}</td>
                <td className="px-4 py-3">{t.channel}</td>
                <td className="px-4 py-3">{t.category}</td>
                <td className="px-4 py-3">{STATUS_LABEL[t.status]}</td>
                <td className="px-4 py-3">{t.assignee?.name ?? "—"}</td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-400">
                  Nenhum ticket registrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
