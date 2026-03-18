import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { KarritoApiClient } from '../lib/api-client.js';

export function register(server: McpServer, client: KarritoApiClient): void {
  // --- get_my_store (auth required) ---
  server.tool(
    'get_my_store',
    'Get information about your Karrito store (name, slug, currency, stats). Requires KARRITO_API_KEY environment variable.',
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
        const data = await client.getStore();
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
          content: [{ type: 'text' as const, text: `Error getting store info: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // --- update_store (auth required) ---
  server.tool(
    'update_store',
    'Update your Karrito store settings (name, WhatsApp number, currency, description, etc.). Requires KARRITO_API_KEY environment variable.',
    {
      name: z.string().min(1).max(100).optional().describe('Store name'),
      whatsappNumber: z.string().optional().describe('WhatsApp number in E.164 format (e.g., +18091234567)'),
      currency: z
        .enum(['DOP', 'USD', 'MXN', 'COP', 'ARS', 'BRL'])
        .optional()
        .describe('Store currency'),
      whatsappTemplate: z.string().max(2000).optional().describe('WhatsApp message template with shortcodes: {tienda}, {productos}, {total}, {nombre}'),
      isPublished: z.boolean().optional().describe('Whether the store is publicly visible'),
      isMaintenance: z.boolean().optional().describe('Whether the store is in maintenance mode'),
      description: z.string().max(500).optional().describe('Store description'),
    },
    async ({ ...updates }) => {
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
        const updateData: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(updates)) {
          if (value !== undefined) updateData[key] = value;
        }

        if (Object.keys(updateData).length === 0) {
          return {
            content: [{ type: 'text' as const, text: 'No fields to update. Provide at least one field (name, whatsappNumber, currency, whatsappTemplate, isPublished, isMaintenance, description).' }],
            isError: true,
          };
        }

        const data = await client.updateStore(updateData);
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
          content: [{ type: 'text' as const, text: `Error updating store: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // --- toggle_publish (auth required) ---
  server.tool(
    'toggle_publish',
    'Quickly publish or unpublish your Karrito store. Shortcut for update_store with isPublished. Requires KARRITO_API_KEY environment variable.',
    {
      published: z.boolean().describe('true to publish the store, false to unpublish'),
    },
    async ({ published }) => {
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
        const data = await client.updateStore({ isPublished: published });
        const action = published ? 'published' : 'unpublished';
        return {
          content: [
            {
              type: 'text' as const,
              text: `Store ${action} successfully.\n\n${JSON.stringify(data, null, 2)}`,
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return {
          content: [{ type: 'text' as const, text: `Error toggling publish: ${message}` }],
          isError: true,
        };
      }
    }
  );
}
