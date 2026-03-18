import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { KarritoApiClient } from '../lib/api-client.js';

export function register(server: McpServer, client: KarritoApiClient): void {
  // --- list_my_orders (auth required) ---
  server.tool(
    'list_my_orders',
    'List orders from your Karrito store. Requires KARRITO_API_KEY environment variable.',
    {
      limit: z.number().min(1).max(100).default(50).describe('Max orders to return (1-100)'),
      offset: z.number().min(0).default(0).describe('Pagination offset'),
      status: z
        .enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
        .optional()
        .describe('Filter by order status'),
    },
    async ({ limit, offset, status }) => {
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
        const data = await client.listOrders(limit, offset, status);
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
          content: [{ type: 'text' as const, text: `Error listing orders: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // --- get_order (auth required) ---
  server.tool(
    'get_order',
    'Get detailed information about a specific order including items, customer info, and status. Requires KARRITO_API_KEY environment variable.',
    {
      id: z.string().describe('Order ID to retrieve'),
    },
    async ({ id }) => {
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
        const data = await client.getOrder(id);
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
          content: [{ type: 'text' as const, text: `Error getting order: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // --- update_order_status (auth required) ---
  server.tool(
    'update_order_status',
    'Update the status of an order (e.g., confirm, ship, deliver, or cancel). Requires KARRITO_API_KEY environment variable.',
    {
      id: z.string().describe('Order ID to update'),
      status: z
        .enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
        .describe('New order status'),
    },
    async ({ id, status }) => {
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
        const data = await client.updateOrderStatus(id, status);
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
          content: [{ type: 'text' as const, text: `Error updating order status: ${message}` }],
          isError: true,
        };
      }
    }
  );
}
