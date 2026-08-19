import { prisma } from "@/lib/prisma";
import { LEAD_STAGE_ORDER, LEAD_STAGE_LABELS, nextStage } from "@/lib/leadStages";
import {
  advanceLeadAction,
  markLeadLostAction,
  convertLeadToClientAction,
} from "./actions";
import NewLeadForm from "./NewLeadForm";

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    where: { stage: { not: "PERDIDO" } },
    orderBy: { createdAt: "desc" },
    include: { owner: true, client: true },
  });

  const byStage = LEAD_STAGE_ORDER.map((stage) => ({
    stage,
    leads: leads.filter((lead) => lead.stage === stage),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Comercial · Pipeline de leads</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Do lead novo ao fechamento — os mesmos 9 estágios do mapa do board.
          </p>
        </div>
        <NewLeadForm />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {byStage.map(({ stage, leads: stageLeads }) => (
          <div key={stage} className="flex w-64 shrink-0 flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {LEAD_STAGE_LABELS[stage]}
              </p>
              <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-600">
                {stageLeads.length}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {stageLeads.map((lead) => {
                const target = nextStage(lead.stage);
                return (
                  <div
                    key={lead.id}
                    className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm"
                  >
                    <p className="text-sm font-medium text-zinc-900">{lead.name}</p>
                    {lead.company && (
                      <p className="text-xs text-zinc-500">{lead.company}</p>
                    )}
                    {lead.source && (
                      <p className="mt-1 text-[11px] text-zinc-400">origem: {lead.source}</p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {target && (
                        <form action={advanceLeadAction.bind(null, lead.id, lead.stage)}>
                          <button
                            type="submit"
                            className="rounded-md bg-zinc-900 px-2 py-1 text-[11px] font-medium text-white hover:bg-zinc-700"
                          >
                            Avançar →
                          </button>
                        </form>
                      )}

                      {lead.stage === "FECHADO_GANHO" && !lead.client && (
                        <form action={convertLeadToClientAction.bind(null, lead.id)}>
                          <button
                            type="submit"
                            className="rounded-md bg-emerald-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-emerald-500"
                          >
                            Virar cliente
                          </button>
                        </form>
                      )}

                      {lead.stage !== "FECHADO_GANHO" && (
                        <form action={markLeadLostAction.bind(null, lead.id)}>
                          <button
                            type="submit"
                            className="rounded-md border border-zinc-300 px-2 py-1 text-[11px] font-medium text-zinc-500 hover:bg-zinc-100"
                          >
                            Perdido
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                );
              })}

              {stageLeads.length === 0 && (
                <p className="rounded-xl border border-dashed border-zinc-200 p-3 text-center text-xs text-zinc-400">
                  vazio
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
