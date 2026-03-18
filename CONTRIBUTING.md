# Contributing to karrito-mcp

Thanks for your interest in contributing!

## Development

```bash
git clone https://github.com/curetcore/karrito-mcp
cd karrito-mcp
npm install
npm run dev
```

## Project structure

```
src/
  index.ts              # MCP server entry point
  lib/
    api-client.ts       # HTTP client for Karrito API
  resources/            # Static data (no auth required)
    pricing.ts
    features.ts
    niches.ts
    competitors.ts
    currencies.ts
  tools/                # MCP tools (most require auth)
    catalog.ts          # Public: search_catalogs, get_niche_info
    products.ts         # CRUD products
    categories.ts       # CRUD categories
    orders.ts           # List, get, update status
    discounts.ts        # CRUD discount codes
    reviews.ts          # List, moderate, delete
    customers.ts        # List, get detail
    store.ts            # Get/update store, toggle publish
    shipping.ts         # CRUD shipping options
    stats.ts            # Analytics: orders, revenue, AOV, popular
```

## Guidelines

- TypeScript strict mode
- Keep tools focused — one file per domain
- All tool inputs validated with Zod
- No secrets or API keys in code
- Test with `npx karrito-mcp` locally before submitting

## Reporting issues

Open an issue at https://github.com/curetcore/karrito-mcp/issues
