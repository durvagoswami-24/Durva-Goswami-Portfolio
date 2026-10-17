import type { Locale } from "../../i18n/types";

// ==============================================================================
// CENTRAL PROJECT REGISTRY
// To add a new project in the future:
// 1. Add your project slug string here in projectIds array.
// 2. Add thumbnail entry in src/content/projects/previews/en.ts
// 3. Create a detailed file in src/content/projects/en/<slug>.ts
// ==============================================================================
export const projectIds = [
  "bfm-times",
  "avikansa-divine",
];

function simplifyModules(glob: Record<string, any>) {
  const result: Record<string, any> = {};
  for (const [path, mod] of Object.entries(glob)) {
    const match = path.match(/\/([a-z0-9_-]+)\.ts$/i);
    if (match) result[match[1] as string] = mod;
  }
  return result;
}

export const projectModules = {
  de: simplifyModules(import.meta.glob("./en/*.ts", { eager: true })),
  en: simplifyModules(import.meta.glob("./en/*.ts", { eager: true })),
} as const satisfies Record<Locale, Record<string, any>>;
