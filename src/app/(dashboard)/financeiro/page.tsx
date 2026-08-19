import { prisma } from "@/lib/prisma";

const TYPE_LABEL: Record<string, string> = {
  RECEITA: "Receita",
  DESPESA: "Despesa",
  COMISSAO: "Comissão",
};

const STATUS_LABEL: Record<string, string> = {
  PENDENTE: "Pendente",
  PAGO: "Pago",
  ATRASADO: "Atrasado",
};

export default async function FinanceiroPage() {
  const entries = await prisma.financialEntry.findMany({
    orderBy: { dueDate: "desc" },
    include: { client: true },
    take: 50,
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Financeiro</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Contrato → cobrança → pagamento → conciliação. Alimenta MRR e receita no Dashboard CEO.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Vencimento</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {entries.map((e) => (
              <tr key={e.id}>
                <td className="px-4 py-3 font-medium text-zinc-900">{e.client?.name ?? "—"}</td>
                <td className="px-4 py-3">{TYPE_LABEL[e.type]}</td>
                <td className="px-4 py-3">R$ {e.amount.toString()}</td>
                <td className="px-4 py-3">{e.dueDate.toLocaleDateString("pt-BR")}</td>
                <td className="px-4 py-3">{STATUS_LABEL[e.status]}</td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-400">
                  Nenhum lançamento ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
