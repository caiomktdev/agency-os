import { prisma } from "@/lib/prisma";

export default async function ProjetosPage() {
  const projects = await prisma.project.findMany({
    orderBy: { startDate: "desc" },
    include: { client: true, tasks: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Projetos</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Próximo módulo a construir: Kanban por esteira (Conteúdo, Tráfego, Vídeo, Dev), com SLA e responsável.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Projeto</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tarefas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {projects.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-zinc-900">{p.name}</td>
                <td className="px-4 py-3">{p.client.name}</td>
                <td className="px-4 py-3">{p.status}</td>
                <td className="px-4 py-3">{p.tasks.length}</td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-400">
                  Nenhum projeto criado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
