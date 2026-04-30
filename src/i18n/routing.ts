import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "it", "pt", "es", "de", "fr"],
  defaultLocale: "en",
})
