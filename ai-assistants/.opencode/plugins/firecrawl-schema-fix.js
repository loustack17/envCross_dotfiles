const UNSUPPORTED_DOMAIN_PATTERN = "^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$"
const COMPAT_DOMAIN_PATTERN = "^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$"

function rewritePatterns(value) {
  if (!value || typeof value !== "object") return

  if (Array.isArray(value)) {
    for (const item of value) rewritePatterns(item)
    return
  }

  if (typeof value.pattern === "string" && value.pattern === UNSUPPORTED_DOMAIN_PATTERN) {
    value.pattern = COMPAT_DOMAIN_PATTERN
  }

  for (const nested of Object.values(value)) rewritePatterns(nested)
}

export default async function firecrawlSchemaFixPlugin() {
  return {
    async "tool.definition"(input, output) {
      if (!input.toolID.toLowerCase().includes("firecrawl")) return
      rewritePatterns(output.parameters)
    },
  }
}
