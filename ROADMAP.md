# Roadmap de desenvolvimento

Mesma lógica de fases do plano de ação (Organizar → Padronizar → Automatizar
→ Medir → Escalar), agora como tarefas de programação. O módulo de **Leads**
já serve de referência de padrão para os demais (Server Component para
listar, Server Actions para mutar, revalidatePath para atualizar a tela).

## Já pronto

- Schema completo do banco (`prisma/schema.prisma`) com as 10+ entidades do HUB.
- Autenticação própria (login, sessão em cookie, proteção de rotas via `src/proxy.ts`).
- Dashboard inicial com KPIs reais (contagens direto do banco).
- Módulo **Comercial (Leads)**: Kanban dos 9 estágios, criar lead, avançar estágio, marcar perdido, converter em cliente.
- Módulo **Clientes**: listagem com saúde do cliente.
- Telas iniciais (somente leitura) de Projetos, Atendimento e Financeiro.

## Fase 1 — Completar o núcleo de dados (próximas 2-3 semanas)

- [ ] CRUD completo de **Clientes** (editar dados, mudar saúde manualmente).
- [ ] CRUD de **Contratos** vinculados a um cliente.
- [ ] Formulário de edição de Lead (hoje só existe criação).
- [ ] Página de detalhe do Lead/Cliente (histórico, timeline de interações).

## Fase 2 — Produção e atendimento (Kanban real)

- [ ] Módulo **Projetos**: criar projeto ao converter lead em cliente (automatizar isso na `convertLeadToClientAction`).
- [ ] Kanban de **Tarefas** por projeto (A fazer / Em andamento / Revisão / Concluída), com responsável e prazo.
- [ ] Módulo **Conteúdo**: pipeline de produção (ideia → copy → design → revisão → aprovação → agendado → publicado), refletindo as 4 esteiras do board.
- [ ] Módulo **Atendimento**: criar/editar tickets, cálculo automático de `slaDeadline` a partir da prioridade (1h / 4h úteis / 24h) e alerta visual quando estourar.

## Fase 3 — Automação (n8n conectado ao sistema)

Para o n8n conseguir ler/escrever no seu banco, exponha endpoints internos
(Route Handlers em `src/app/api/`) protegidos por uma chave de API simples,
ou conecte o n8n direto no Postgres (nó "Postgres" do n8n aponta para o
mesmo banco do app — funciona bem para leitura e para automações que só
inserem registros).

- [ ] Automação 1 — novo lead → IA qualifica (chamada à API da OpenAI/Claude dentro do n8n) → grava `fit` no lead → dispara WhatsApp.
- [ ] Automação 2 — lead fechado → cria projeto e dispara onboarding automaticamente (hoje isso é manual via botão "Virar cliente").
- [ ] Automação 3 — follow-up de propostas paradas há mais de X dias.
- [ ] Automação de backup diário do Postgres (dump + upload para storage externo).

## Fase 4 — Medir

- [ ] Job (via n8n ou uma rota agendada) que calcula métricas diárias (SLA cumprido, produtividade, CAC) e grava na tabela `Metric`.
- [ ] Gráficos no Dashboard CEO (pode usar Recharts ou Tremor, direto no Next.js, lendo da tabela `Metric`).
- [ ] Relatório mensal por cliente gerado automaticamente (n8n lê `Metric`/`FinancialEntry`/`Feedback` do Postgres e usa IA para redigir o resumo).

## Fase 5 — Escalar

- [ ] Regras automáticas de saúde do cliente (`ClientHealth`) com base em atraso de pagamento + resultado + tickets abertos.
- [ ] Papéis e permissões mais finos (hoje `Role` já existe no schema, falta usar em cada tela para esconder/mostrar ações).
- [ ] Auditoria (quem mudou o quê) — tabela de log simples ligada às principais mutações.
- [ ] Testes automatizados (Playwright para os fluxos críticos: login, pipeline de leads, fechamento).

## Convenções ao adicionar um módulo novo

Siga o padrão já usado em `src/app/(dashboard)/leads/`:

1. `page.tsx` — Server Component, busca dados direto com `prisma.*.findMany(...)`.
2. `actions.ts` — funções `"use server"`, sempre chamando `requireSession()` primeiro, validando o input, e terminando com `revalidatePath(...)`.
3. Componentes de formulário que precisam de interatividade (abrir/fechar, estado local) viram um Client Component separado (`"use client"`), como `NewLeadForm.tsx`.
4. Nunca confie em dados vindos do client para decidir permissão — sempre releia do banco dentro da Server Action (ver exemplo de segurança nos comentários de `leads/actions.ts`).
