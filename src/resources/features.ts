import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const FEATURES_DATA = {
  core: [
    { name: 'Digital catalog', description: 'Beautiful product catalog with categories, images, and variants' },
    { name: 'WhatsApp checkout', description: 'Customers order via WhatsApp message — no payment gateway needed' },
    { name: 'Custom slug', description: 'Your store at karrito.shop/your-name or custom domain' },
    { name: 'Mobile-first', description: 'Optimized for mobile browsers where 90%+ LATAM traffic comes from' },
    { name: 'Multi-currency', description: 'DOP, MXN, COP, ARS, CLP, USD supported natively' },
    { name: 'Product variants', description: 'Size, color, flavor — any variant type (Pro+)' },
    { name: 'Categories', description: 'Organize products with drag-and-drop categories' },
    { name: 'Product images', description: 'Up to 5 images per product with automatic optimization' },
    { name: 'Store customization', description: 'Logo, banner, colors, and social links' },
    { name: 'SEO optimized', description: 'Each catalog is a fully indexed page with structured data' },
  ],
  pro: [
    { name: 'Analytics dashboard', description: 'Views, clicks, orders, top products, conversion funnel' },
    { name: 'Custom domain', description: 'Use your own domain (e.g., tienda.tudominio.com)' },
    { name: 'Remove branding', description: 'No "Powered by Karrito" badge' },
    { name: 'Priority support', description: 'WhatsApp support with <4h response time' },
    { name: 'Bulk import', description: 'Import products via CSV' },
    { name: 'Order history', description: 'Track and manage customer orders' },
  ],
  upcoming: [
    { name: 'AI product descriptions', description: 'Generate compelling product descriptions with AI' },
    { name: 'Instagram sync', description: 'Import products from Instagram posts' },
    { name: 'Multi-store', description: 'Manage multiple catalogs from one account' },
    { name: 'Delivery zones', description: 'Configure delivery areas and fees' },
    { name: 'Payment links', description: 'Accept card payments via Stripe/MercadoPago' },
  ],
  url: 'https://karrito.shop/features',
};

export function register(server: McpServer): void {
  server.resource(
    'features',
    'karrito://features',
    {
      description: 'Complete list of Karrito features — core, pro, and upcoming',
      mimeType: 'application/json',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(FEATURES_DATA, null, 2),
          mimeType: 'application/json',
        },
      ],
    })
  );
}
