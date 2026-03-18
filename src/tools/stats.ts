import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { KarritoApiClient } from '../lib/api-client.js';

export function register(server: McpServer, client: KarritoApiClient): void {
  // --- get_analytics (auth required) ---
  server.tool(
    'get_analytics',
    'Get store analytics: total orders, revenue, products, customers, average order value, and popular products. Requires KARRITO_API_KEY environment variable.',
    {},
    async () => {
      if (!client.hasApiKey) {
        return {
          content: [
            {
              type: 'text' as const,
              text: 'Authentication required. Set the KARRITO_API_KEY environment variable with your Karrito API key. You can generate one at https://karrito.shop/settings/api',
            },
          ],
          isError: true,
        };
      }

      try {
        const data = await client.getStats();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return {
          content: [{ type: 'text' as const, text: `Error getting analytics: ${message}` }],
          isError: true,
        };
      }
    }
  );
}
