import { prisma } from "@/lib/prisma";

function Card({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-zinc-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-zinc-400">{hint}</p>}
    </div>
  );
}

export default async function DashboardPage() {
  const [
    openLeads,
    wonLeads,
    clientsAtRisk,
    totalClients,
    openTickets,
    pendingFinancial,
  ] = await Promise.all([
    prisma.lead.count({
      where: { stage: { notIn: ["FECHADO_GANHO", "PERDIDO"] } },
    }),
    prisma.lead.count({ where: { stage: "FECHADO_GANHO" } }),
    prisma.client.count({ where: { health: "RISCO_CHURN" } }),
    prisma.client.count(),
    prisma.communicationTicket.count({ where: { status: { not: "RESOLVIDO" } } }),
    prisma.financialEntry.aggregate({
      where: { status: "PENDENTE" },
      _sum: { amount: true },
    }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Dashboard CEO</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Visão única de comercial, clientes, atendimento e financeiro — tudo lendo do mesmo banco de dados.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <Card label="Leads no funil" value={openLeads} hint="Fora de fechado/perdido" />
        <Card label="Negócios fechados" value={wonLeads} />
        <Card label="Clientes ativos" value={totalClients} />
        <Card label="Clientes em risco" value={clientsAtRisk} hint="Saúde: risco de churn" />
        <Card label="Tickets em aberto" value={openTickets} />
        <Card
          label="Financeiro pendente"
          value={`R$ ${(pendingFinancial._sum.amount ?? 0).toString()}`}
        />
      </div>

      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-5 text-sm text-zinc-500">
        Este painel é o ponto de partida do &quot;Dashboard CEO&quot;. Conforme os módulos de Projetos,
        Atendimento e Financeiro forem ganhando telas próprias, adicione aqui os KPIs de cada área
        (SLA cumprido, produtividade, CAC, ROAS) lendo sempre das mesmas tabelas do banco central.
      </div>
    </div>
  );
}
