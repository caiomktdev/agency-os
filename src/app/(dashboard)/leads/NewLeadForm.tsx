"use client";

import { useRef, useState } from "react";
import { createLeadAction } from "./actions";

export default function NewLeadForm() {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
      >
        + Novo lead
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-80 rounded-xl border border-zinc-200 bg-white p-4 shadow-lg">
          <form
            ref={formRef}
            action={async (formData) => {
              await createLeadAction(formData);
              formRef.current?.reset();
              setOpen(false);
            }}
            className="flex flex-col gap-3"
          >
            <input
              name="name"
              required
              placeholder="Nome do lead *"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
            <input
              name="company"
              placeholder="Empresa"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
            <input
              name="phone"
              placeholder="WhatsApp"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
            <input
              name="email"
              type="email"
              placeholder="E-mail"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
            <select
              name="source"
              defaultValue=""
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            >
              <option value="">Origem…</option>
              <option value="instagram">Instagram</option>
              <option value="google_ads">Google Ads</option>
              <option value="meta_ads">Meta Ads</option>
              <option value="indicacao">Indicação</option>
              <option value="prospeccao">Prospecção ativa</option>
              <option value="site">Site / Blog</option>
              <option value="outro">Outro</option>
            </select>

            <div className="mt-1 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700"
              >
                Adicionar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
