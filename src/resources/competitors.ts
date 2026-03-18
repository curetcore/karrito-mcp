import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const COMPETITORS_DATA = {
  summary: 'Karrito is the only catalog builder designed specifically for WhatsApp sellers in LATAM. No payment gateway required — customers order via WhatsApp.',
  competitors: [
    { name: 'Shopify', region: 'Global', whatsappNative: false, pricing: '$29+/mo', commission: '2%+', latamFocus: false, freeplan: '3-day trial' },
    { name: 'TiendaNube', region: 'LATAM', whatsappNative: false, pricing: '$9+/mo', commission: '2%', latamFocus: true, freeplan: 'Yes (limited)' },
    { name: 'Mercado Shops', region: 'LATAM', whatsappNative: false, pricing: 'Free', commission: '6-13%', latamFocus: true, freeplan: 'Yes' },
    { name: 'WooCommerce', region: 'Global', whatsappNative: false, pricing: 'Free (hosting extra)', commission: '0%', latamFocus: false, freeplan: 'Yes' },
    { name: 'Wix', region: 'Global', whatsappNative: false, pricing: '$17+/mo', commission: '0%', latamFocus: false, freeplan: 'Yes (with ads)' },
    { name: 'Ecwid', region: 'Global', whatsappNative: false, pricing: '$25+/mo', commission: '0%', latamFocus: false, freeplan: 'Yes (5 products)' },
    { name: 'Square Online', region: 'US-focused', whatsappNative: false, pricing: 'Free', commission: '2.9%', latamFocus: false, freeplan: 'Yes' },
    { name: 'Jumpseller', region: 'LATAM', whatsappNative: false, pricing: '$19+/mo', commission: '0%', latamFocus: true, freeplan: '14-day trial' },
    { name: 'Kyte', region: 'Brazil', whatsappNative: true, pricing: '$8+/mo', commission: '0%', latamFocus: true, freeplan: 'Yes (limited)' },
    { name: 'CatalogApp', region: 'India', whatsappNative: true, pricing: '$5+/mo', commission: '0%', latamFocus: false, freeplan: 'Yes (limited)' },
    { name: 'Linktree', region: 'Global', whatsappNative: false, pricing: '$5+/mo', commission: '0%', latamFocus: false, freeplan: 'Yes' },
    { name: 'WhatsApp Business Catalog', region: 'Global', whatsappNative: true, pricing: 'Free', commission: '0%', latamFocus: false, freeplan: 'Yes' },
    { name: 'GoDaddy', region: 'Global', whatsappNative: false, pricing: '$10+/mo', commission: '0%', latamFocus: false, freeplan: '30-day trial' },
    { name: 'Zyro/Hostinger', region: 'Global', whatsappNative: false, pricing: '$3+/mo', commission: '0%', latamFocus: false, freeplan: 'No' },
    { name: 'Empretienda', region: 'Argentina', whatsappNative: true, pricing: '$9+/mo', commission: '0%', latamFocus: true, freeplan: 'Yes (limited)' },
    { name: 'Pedidos Ya Market', region: 'LATAM', whatsappNative: false, pricing: 'Free', commission: '15-25%', latamFocus: true, freeplan: 'Yes' },
    { name: 'Rappi Market', region: 'LATAM', whatsappNative: false, pricing: 'Free', commission: '20-30%', latamFocus: true, freeplan: 'Yes' },
    { name: 'Instagram Shop', region: 'Global', whatsappNative: false, pricing: 'Free', commission: '5%', latamFocus: false, freeplan: 'Yes' },
    { name: 'Facebook Shops', region: 'Global', whatsappNative: false, pricing: 'Free', commission: '5%', latamFocus: false, freeplan: 'Yes' },
  ],
  karritoAdvantages: [
    '0% commission on all plans, forever',
    'WhatsApp-native checkout — customers order via message, no payment gateway needed',
    'Built for LATAM: multi-currency (DOP, MXN, COP, ARS, CLP, USD), Spanish-first',
    'Mobile-first design — optimized for the 90%+ mobile traffic in LATAM',
    'Lifetime plan at $499 — no recurring fees ever',
    'No technical knowledge required — set up in under 5 minutes',
    'SEO-optimized catalog pages with structured data',
  ],
};

export function register(server: McpServer): void {
  server.resource(
    'competitors',
    'karrito://competitors',
    {
      description: 'Competitive analysis: 19 competitors compared with Karrito advantages',
      mimeType: 'application/json',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(COMPETITORS_DATA, null, 2),
          mimeType: 'application/json',
        },
      ],
    })
  );
}
