#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { KarritoApiClient } from './lib/api-client.js';

// Resources
import { register as registerPricing } from './resources/pricing.js';
import { register as registerFeatures } from './resources/features.js';
import { register as registerNiches } from './resources/niches.js';
import { register as registerCompetitors } from './resources/competitors.js';
import { register as registerCurrencies } from './resources/currencies.js';

// Tools
import { register as registerCatalogTools } from './tools/catalog.js';
import { register as registerProductTools } from './tools/products.js';
import { register as registerOrderTools } from './tools/orders.js';
import { register as registerCategoryTools } from './tools/categories.js';
import { register as registerStoreTools } from './tools/store.js';
import { register as registerDiscountTools } from './tools/discounts.js';
import { register as registerReviewTools } from './tools/reviews.js';
import { register as registerCustomerTools } from './tools/customers.js';
import { register as registerStatsTools } from './tools/stats.js';
import { register as registerShippingTools } from './tools/shipping.js';

const server = new McpServer({
  name: 'karrito',
  version: '2.0.0',
});

const client = new KarritoApiClient();

// Register static resources (public, no auth needed)
registerPricing(server);
registerFeatures(server);
registerNiches(server);
registerCompetitors(server);
registerCurrencies(server);

// Register tools
registerCatalogTools(server, client);
registerProductTools(server, client);
registerOrderTools(server, client);
registerCategoryTools(server, client);
registerStoreTools(server, client);
registerDiscountTools(server, client);
registerReviewTools(server, client);
registerCustomerTools(server, client);
registerStatsTools(server, client);
registerShippingTools(server, client);

// ─── ANSI Colors ───
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[38;2;16;185;129m',    // emerald-500
  greenBg: '\x1b[48;2;16;185;129m',
  red: '\x1b[38;2;239;68;68m',
  yellow: '\x1b[38;2;245;158;11m',
  gray: '\x1b[38;2;148;163;184m',
  white: '\x1b[37m',
  cyan: '\x1b[36m',
}

function line(text: string) { console.error(text) }
function pad(str: string, len: number) { return str.padEnd(len) }

interface StoreInfo {
  data: {
    name: string
    slug: string
    currency: string
    isPublished: boolean
    productCount: number
    categoryCount: number
    orderCount: number
  }
}

async function verifyConnection(): Promise<{ store: StoreInfo['data'] | null; latency: number; error: string | null }> {
  if (!client.hasApiKey) return { store: null, latency: 0, error: null }

  const start = Date.now()
  try {
    const result = await client.getStore() as StoreInfo
    return { store: result.data, latency: Date.now() - start, error: null }
  } catch (err) {
    return { store: null, latency: Date.now() - start, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// Connect via stdio
async function main(): Promise<void> {
  const hasKey = client.hasApiKey
  const apiKey = process.env.KARRITO_API_KEY ?? ''
  const maskedKey = hasKey
    ? `${apiKey.slice(0, 8)}${'·'.repeat(8)}${apiKey.slice(-4)}`
    : 'not configured'

  // Verify connection if API key is present
  const { store, latency, error } = await verifyConnection()

  const VERSION = '2.0.1'
  const TOOLS = 30
  const RESOURCES = 5

  line('')
  line(`  ${c.green}╔${'═'.repeat(51)}╗${c.reset}`)
  line(`  ${c.green}║${c.reset}                                                   ${c.green}║${c.reset}`)
  line(`  ${c.green}║${c.reset}   ${c.bold}${c.green}🛒  Karrito MCP Server${c.reset}  ${c.dim}v${VERSION}${c.reset}                  ${c.green}║${c.reset}`)
  line(`  ${c.green}║${c.reset}                                                   ${c.green}║${c.reset}`)
  line(`  ${c.green}║${c.reset}   ${c.white}${TOOLS} tools${c.reset}  ${c.dim}•${c.reset}  ${c.white}${RESOURCES} resources${c.reset}                       ${c.green}║${c.reset}`)
  line(`  ${c.green}║${c.reset}   ${c.dim}Manage your entire store from AI${c.reset}                ${c.green}║${c.reset}`)
  line(`  ${c.green}║${c.reset}                                                   ${c.green}║${c.reset}`)

  if (store) {
    // Connected successfully — show store info
    line(`  ${c.green}╠${'═'.repeat(51)}╣${c.reset}`)
    line(`  ${c.green}║${c.reset}                                                   ${c.green}║${c.reset}`)
    line(`  ${c.green}║${c.reset}   ${c.dim}Store${c.reset}     ${c.bold}${c.white}${pad(store.name, 36)}${c.reset}  ${c.green}║${c.reset}`)
    line(`  ${c.green}║${c.reset}   ${c.dim}Plan${c.reset}      ${pad(store.currency, 37)}  ${c.green}║${c.reset}`)
    line(`  ${c.green}║${c.reset}   ${c.dim}Products${c.reset}  ${pad(`${store.productCount} active`, 37)}  ${c.green}║${c.reset}`)
    line(`  ${c.green}║${c.reset}   ${c.dim}Orders${c.reset}    ${pad(`${store.orderCount} total`, 37)}  ${c.green}║${c.reset}`)
    line(`  ${c.green}║${c.reset}   ${c.dim}Status${c.reset}    ${store.isPublished ? `${c.green}● Published${c.reset}` : `${c.yellow}○ Unpublished${c.reset}`}${' '.repeat(store.isPublished ? 26 : 24)}  ${c.green}║${c.reset}`)
    line(`  ${c.green}║${c.reset}                                                   ${c.green}║${c.reset}`)
    line(`  ${c.green}╠${'═'.repeat(51)}╣${c.reset}`)
    line(`  ${c.green}║${c.reset}                                                   ${c.green}║${c.reset}`)
    line(`  ${c.green}║${c.reset}   ${c.dim}API Key${c.reset}   ${c.cyan}${pad(maskedKey, 37)}${c.reset}  ${c.green}║${c.reset}`)
    line(`  ${c.green}║${c.reset}   ${c.dim}Latency${c.reset}   ${c.green}${pad(`${latency}ms`, 37)}${c.reset}  ${c.green}║${c.reset}`)
    line(`  ${c.green}║${c.reset}   ${c.dim}Status${c.reset}    ${c.green}● Connected${c.reset}                            ${c.green}║${c.reset}`)
  } else if (hasKey && error) {
    // API key set but connection failed
    line(`  ${c.green}╠${'═'.repeat(51)}╣${c.reset}`)
    line(`  ${c.green}║${c.reset}                                                   ${c.green}║${c.reset}`)
    line(`  ${c.green}║${c.reset}   ${c.dim}API Key${c.reset}   ${c.cyan}${pad(maskedKey, 37)}${c.reset}  ${c.green}║${c.reset}`)
    line(`  ${c.green}║${c.reset}   ${c.dim}Status${c.reset}    ${c.red}✕ ${pad(error.slice(0, 35), 35)}${c.reset}  ${c.green}║${c.reset}`)
  } else {
    // No API key — public mode
    line(`  ${c.green}╠${'═'.repeat(51)}╣${c.reset}`)
    line(`  ${c.green}║${c.reset}                                                   ${c.green}║${c.reset}`)
    line(`  ${c.green}║${c.reset}   ${c.dim}API Key${c.reset}   ${c.yellow}${pad('not configured', 37)}${c.reset}  ${c.green}║${c.reset}`)
    line(`  ${c.green}║${c.reset}   ${c.dim}Status${c.reset}    ${c.yellow}○ Public only${c.reset}                          ${c.green}║${c.reset}`)
    line(`  ${c.green}║${c.reset}                                                   ${c.green}║${c.reset}`)
    line(`  ${c.green}║${c.reset}   ${c.dim}Set KARRITO_API_KEY to unlock all 30 tools${c.reset}    ${c.green}║${c.reset}`)
    line(`  ${c.green}║${c.reset}   ${c.dim}Generate at: karrito.shop/admin/settings${c.reset}       ${c.green}║${c.reset}`)
  }

  line(`  ${c.green}║${c.reset}                                                   ${c.green}║${c.reset}`)
  line(`  ${c.green}╠${'═'.repeat(51)}╣${c.reset}`)
  line(`  ${c.green}║${c.reset}                                                   ${c.green}║${c.reset}`)
  line(`  ${c.green}║${c.reset}   ${c.dim}Docs${c.reset}   ${c.cyan}docs.karrito.shop${c.reset}                       ${c.green}║${c.reset}`)
  line(`  ${c.green}║${c.reset}   ${c.dim}npm${c.reset}    ${c.cyan}npmjs.com/package/karrito-mcp${c.reset}           ${c.green}║${c.reset}`)
  line(`  ${c.green}║${c.reset}   ${c.dim}GitHub${c.reset} ${c.cyan}github.com/curetcore/karrito-mcp${c.reset}        ${c.green}║${c.reset}`)
  line(`  ${c.green}║${c.reset}                                                   ${c.green}║${c.reset}`)
  line(`  ${c.green}╚${'═'.repeat(51)}╝${c.reset}`)
  line('')

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error: unknown) => {
  line(`  ${c.red}✕ Fatal error:${c.reset} ${error}`);
  process.exit(1);
});
