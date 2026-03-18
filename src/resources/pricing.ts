import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const PRICING_DATA = {
  plans: [
    {
      name: 'Free',
      price: 0,
      billing: 'forever',
      products: 10,
      categories: 3,
      variants: false,
      analytics: false,
      customDomain: false,
      removeBranding: false,
    },
    {
      name: 'Pro',
      price: 29,
      billing: 'monthly',
      yearlyPrice: 290,
      products: 500,
      categories: 50,
      variants: true,
      analytics: true,
      customDomain: true,
      removeBranding: true,
    },
    {
      name: 'Lifetime',
      price: 499,
      billing: 'one-time',
      products: 'unlimited',
      categories: 'unlimited',
      variants: true,
      analytics: true,
      customDomain: true,
      removeBranding: true,
    },
  ],
  commissions: 'Never. 0% on all plans.',
  trial: '14-day free Pro trial for all new users',
  refund: '7-day money-back guarantee on Pro and Lifetime',
  url: 'https://karrito.shop/pricing',
};

export function register(server: McpServer): void {
  server.resource(
    'pricing',
    'karrito://pricing',
    {
      description: 'Karrito pricing plans, features comparison, and billing details',
      mimeType: 'application/json',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(PRICING_DATA, null, 2),
          mimeType: 'application/json',
        },
      ],
    })
  );
}
