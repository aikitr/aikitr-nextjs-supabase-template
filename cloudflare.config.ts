import { bindings, defineConfig, defineWorker } from "cf/config";

function requiredTextBinding(name: string) {
  return bindings.text(process.env[name]?.trim() ?? "");
}

export default defineConfig({
  worker: defineWorker({
    name: "aikitr-nextjs-supabase-template",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-02",
    compatibilityFlags: ["nodejs_compat"],
    assets: { notFoundHandling: "none" },
    env: {
      ASSETS: bindings.assets(),
      NEXT_PUBLIC_SUPABASE_URL: requiredTextBinding("NEXT_PUBLIC_SUPABASE_URL"),
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: requiredTextBinding(
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      ),
      SITE_URL: requiredTextBinding("SITE_URL"),
    },
  }),
});
