# Agency OS

Sistema próprio da agência — o HUB de dados central (CRM, projetos, atendimento,
financeiro) descrito no plano de ação, agora programado do zero em vez de
comprado como SaaS. Next.js (App Router) + PostgreSQL + Docker, feito para
rodar numa VPS própria (ex.: Hostinger).

## Stack

- **Next.js 16** (App Router, Server Actions, TypeScript, Tailwind CSS)
- **PostgreSQL** como banco central — o "HUB de dados" do plano
- **Prisma ORM 7** (com driver adapter `@prisma/adapter-pg`)
- Autenticação própria (cookie httpOnly + JWT via `jose`, sem depender de serviço externo)
- **n8n** self-hosted, rodando ao lado, para as automações (WhatsApp, e-mail, integrações)
- **Docker Compose** + **Caddy** (HTTPS automático) para deploy na VPS

> Este é o esqueleto do sistema, não o produto final. O módulo **Comercial
> (Leads)** está funcional de ponta a ponta (banco → regras → tela). Os
> módulos de Projetos, Atendimento e Financeiro já têm modelo de dados e uma
> tela de leitura — o próximo trabalho é dar CRUD completo a eles, na ordem
> sugerida em [ROADMAP.md](./ROADMAP.md).

## Estrutura do projeto

```
prisma/schema.prisma       modelo de dados do HUB (todas as entidades do board)
prisma/seed.ts             cria o usuário CEO inicial + leads de exemplo
src/lib/prisma.ts          client Prisma (singleton)
src/lib/auth.ts            hash de senha, sessão (JWT em cookie)
src/proxy.ts               protege as rotas (redireciona não autenticados para /login)
src/app/login/             tela de login
src/app/(dashboard)/       tudo que exige login: dashboard, leads, clientes, projetos...
  layout.tsx                menu lateral + sessão
  page.tsx                  Dashboard CEO (KPIs em tempo real)
  leads/                     pipeline comercial (Kanban funcional)
  clientes/                  lista de clientes (convertidos de leads fechados)
  projetos/ atendimento/ financeiro/   telas iniciais, prontas para virar CRUD completo
```

## Rodando localmente (sem Docker)

Pré-requisitos: Node.js 22+, PostgreSQL rodando localmente.

```bash
npm install
cp .env.example .env.local   # ajuste DATABASE_URL e AUTH_SECRET para o seu Postgres local
# no .env.local, DATABASE_URL deve apontar para o seu Postgres, ex.:
# DATABASE_URL="postgresql://postgres:senha@localhost:5432/agency_os?schema=public"

npx prisma migrate dev --name init
npm run db:seed              # cria o usuário CEO (ceo@agencia.com / veja o script)
npm run dev                  # http://localhost:3000
```

## Deploy na VPS (Hostinger, com Docker)

1. **Provisione a VPS** (Ubuntu 22.04+) e instale o Docker:
   ```bash
   curl -fsSL https://get.docker.com | sh
   ```
2. **Aponte o DNS**: crie registros A para `app.suaagencia.com.br` e
   `automacoes.suaagencia.com.br` (ou os domínios que preferir) apontando
   para o IP da VPS. O Caddy usa isso para emitir HTTPS automaticamente —
   sem essa etapa o certificado não é emitido.
3. **Copie o projeto para a VPS** (git clone do seu repositório, ou `scp`).
4. **Configure o ambiente**:
   ```bash
   cp .env.example .env
   nano .env   # preencha senhas, AUTH_SECRET, domínios
   ```
5. **Suba os containers**:
   ```bash
   docker compose up -d --build
   ```
   Isso sobe: `postgres`, `app` (roda `prisma migrate deploy` automaticamente
   ao iniciar), `n8n` e `caddy` (proxy + HTTPS).
6. **Crie o usuário CEO inicial**:
   ```bash
   docker compose exec app npm run db:seed
   ```
7. Acesse `https://app.suaagencia.com.br` e `https://automacoes.suaagencia.com.br` (n8n).

### Backups

O Postgres roda num volume Docker (`postgres_data`). Configure um backup
regular, por exemplo:

```bash
docker compose exec -T postgres pg_dump -U agency agency_os > backup_$(date +%F).sql
```

Automatize isso com um cron na própria VPS ou, melhor ainda, com um workflow
de n8n que roda o dump e envia para um storage externo (S3, Google Drive).

### Atualizando depois de uma mudança de código

```bash
git pull
docker compose up -d --build app
```

O `Dockerfile` roda `prisma migrate deploy` automaticamente antes de subir o
servidor, então novas migrations do Prisma são aplicadas sozinhas.

## Segurança — antes de ir para produção

- Troque **todas** as senhas de exemplo em `.env` (Postgres, n8n, `AUTH_SECRET`).
- `AUTH_SECRET` deve ser uma string aleatória longa (`openssl rand -base64 32`), nunca reaproveitada de outro projeto.
- Considere colocar um WAF/firewall básico na VPS (ex.: `ufw` liberando só 22/80/443).
- Adicione 2FA no acesso SSH da VPS.
- Depois do primeiro login, troque a senha do usuário CEO criado pelo seed.

## Próximos passos de desenvolvimento

Veja [ROADMAP.md](./ROADMAP.md) para a ordem sugerida de construção dos
próximos módulos (Projetos/Kanban, Atendimento, Financeiro, automações n8n,
dashboards) — é a mesma lógica de fases do plano de ação, adaptada para
quem vai programar o sistema.
