"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { nextStage } from "@/lib/leadStages";
import type { LeadStage } from "@/generated/prisma/enums";

export async function createLeadAction(formData: FormData) {
  const session = await requireSession();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await prisma.lead.create({
    data: {
      name,
      company: String(formData.get("company") ?? "") || null,
      phone: String(formData.get("phone") ?? "") || null,
      email: String(formData.get("email") ?? "") || null,
      source: String(formData.get("source") ?? "") || null,
      ownerId: session.userId,
    },
  });

  revalidatePath("/leads");
}

export async function advanceLeadAction(leadId: string, currentStage: LeadStage) {
  "use server";
  await requireSession();

  const target = nextStage(currentStage);
  if (!target) return;

  await prisma.lead.update({
    where: { id: leadId },
    data: { stage: target },
  });

  revalidatePath("/leads");
}

export async function markLeadLostAction(leadId: string) {
  "use server";
  await requireSession();

  await prisma.lead.update({
    where: { id: leadId },
    data: { stage: "PERDIDO" },
  });

  revalidatePath("/leads");
}

export async function convertLeadToClientAction(leadId: string) {
  "use server";
  await requireSession();

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead || lead.stage !== "FECHADO_GANHO") return;

  await prisma.client.upsert({
    where: { fromLeadId: leadId },
    update: {},
    create: {
      name: lead.company || lead.name,
      fromLeadId: leadId,
    },
  });

  revalidatePath("/leads");
  revalidatePath("/clientes");
}
