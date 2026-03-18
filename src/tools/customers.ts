import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { KarritoApiClient } from '../lib/api-client.js';

function authError() {
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

export function register(server: McpServer, client: KarritoApiClient): void {
  // --- list_customers (auth required) ---
  server.tool(
    'list_customers',
    'List customers who have placed orders in your Karrito store. Requires KARRITO_API_KEY environment variable.',
    {
      limit: z.number().min(1).max(100).default(50).describe('Max customers to return (1-100)'),
      offset: z.number().min(0).default(0).describe('Pagination offset'),
    },
    async ({ limit, offset }) => {
      if (!client.hasApiKey) return authError();

      try {
        const data = await client.listCustomers(limit, offset);
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
          content: [{ type: 'text' as const, text: `Error listing customers: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // --- get_customer (auth required) ---
  server.tool(
    'get_customer',
    'Get detailed information about a specific customer including their order history. Requires KARRITO_API_KEY environment variable.',
    {
      id: z.string().describe('Customer ID to retrieve'),
    },
    async ({ id }) => {
      if (!client.hasApiKey) return authError();

      try {
        const data = await client.getCustomer(id);
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
          content: [{ type: 'text' as const, text: `Error getting customer: ${message}` }],
          isError: true,
        };
      }
    }
  );
}
