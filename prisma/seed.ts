import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "ceo@agencia.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "trocar-esta-senha";

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "CEO",
      email,
      passwordHash,
      role: "CEO",
    },
  });

  console.log(`Usuário admin pronto: ${admin.email}`);
  console.log(`Senha inicial: ${password} (troque depois do primeiro login)`);

  const existingLeads = await prisma.lead.count();
  if (existingLeads === 0) {
    await prisma.lead.createMany({
      data: [
        {
          name: "Ana Souza",
          company: "Clínica Boa Forma",
          source: "instagram",
          stage: "NOVO_LEAD",
          ownerId: admin.id,
        },
        {
          name: "Carlos Mendes",
          company: "Mendes Contabilidade",
          source: "indicacao",
          stage: "DIAGNOSTICO",
          ownerId: admin.id,
        },
        {
          name: "Loja Vitrine",
          company: "Vitrine Modas",
          source: "google_ads",
          stage: "PROPOSTA",
          ownerId: admin.id,
        },
      ],
    });
    console.log("Leads de exemplo criados.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
