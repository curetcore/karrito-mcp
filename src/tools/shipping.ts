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
  // --- list_shipping_options (auth required) ---
  server.tool(
    'list_shipping_options',
    'List shipping options configured for your Karrito store. Requires KARRITO_API_KEY environment variable.',
    {},
    async () => {
      if (!client.hasApiKey) return authError();

      try {
        const data = await client.listShipping();
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
          content: [{ type: 'text' as const, text: `Error listing shipping options: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // --- create_shipping_option (auth required) ---
  server.tool(
    'create_shipping_option',
    'Create a new shipping option for your Karrito store (e.g., delivery, pickup, express). Requires KARRITO_API_KEY environment variable.',
    {
      name: z.string().min(1).max(100).describe('Shipping option name (e.g., "Delivery", "Pickup in store", "Express")'),
      price: z.number().min(0).describe('Shipping price in store currency (0 for free shipping)'),
      description: z.string().max(500).optional().describe('Description of this shipping option'),
      estimatedDays: z.number().int().min(0).optional().describe('Estimated delivery time in days'),
      isActive: z.boolean().optional().describe('Whether this shipping option is active (default: true)'),
    },
    async ({ name, price, description, estimatedDays, isActive }) => {
      if (!client.hasApiKey) return authError();

      try {
        const shippingData: Record<string, unknown> = { name, price };
        if (description !== undefined) shippingData.description = description;
        if (estimatedDays !== undefined) shippingData.estimatedDays = estimatedDays;
        if (isActive !== undefined) shippingData.isActive = isActive;

        const data = await client.createShipping(shippingData);
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
          content: [{ type: 'text' as const, text: `Error creating shipping option: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // --- update_shipping_option (auth required) ---
  server.tool(
    'update_shipping_option',
    'Update an existing shipping option in your Karrito store. Requires KARRITO_API_KEY environment variable.',
    {
      id: z.string().describe('Shipping option ID to update'),
      name: z.string().min(1).max(100).optional().describe('New shipping option name'),
      price: z.number().min(0).optional().describe('New shipping price'),
      description: z.string().max(500).optional().describe('New description'),
      estimatedDays: z.number().int().min(0).optional().describe('New estimated delivery time in days'),
      isActive: z.boolean().optional().describe('Whether this shipping option is active'),
    },
    async ({ id, ...updates }) => {
      if (!client.hasApiKey) return authError();

      try {
        const updateData: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(updates)) {
          if (value !== undefined) updateData[key] = value;
        }

        if (Object.keys(updateData).length === 0) {
          return {
            content: [{ type: 'text' as const, text: 'No fields to update. Provide at least one field (name, price, description, estimatedDays, isActive).' }],
            isError: true,
          };
        }

        const data = await client.updateShipping(id, updateData);
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
          content: [{ type: 'text' as const, text: `Error updating shipping option: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // --- delete_shipping_option (auth required) ---
  server.tool(
    'delete_shipping_option',
    'Delete a shipping option from your Karrito store. Requires KARRITO_API_KEY environment variable.',
    {
      id: z.string().describe('Shipping option ID to delete'),
    },
    async ({ id }) => {
      if (!client.hasApiKey) return authError();

      try {
        const data = await client.deleteShipping(id);
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
          content: [{ type: 'text' as const, text: `Error deleting shipping option: ${message}` }],
          isError: true,
        };
      }
    }
  );
}
