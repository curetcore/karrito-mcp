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
  // --- list_discounts (auth required) ---
  server.tool(
    'list_discounts',
    'List discount codes in your Karrito store. Requires KARRITO_API_KEY environment variable.',
    {
      limit: z.number().min(1).max(100).default(50).describe('Max discounts to return (1-100)'),
      offset: z.number().min(0).default(0).describe('Pagination offset'),
    },
    async ({ limit, offset }) => {
      if (!client.hasApiKey) return authError();

      try {
        const data = await client.listDiscounts(limit, offset);
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
          content: [{ type: 'text' as const, text: `Error listing discounts: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // --- create_discount (auth required) ---
  server.tool(
    'create_discount',
    'Create a new discount code for your Karrito store. Requires KARRITO_API_KEY environment variable.',
    {
      code: z.string().min(1).max(50).describe('Discount code (e.g., VERANO20)'),
      type: z.enum(['percentage', 'fixed']).describe('Discount type: percentage (e.g., 20%) or fixed amount (e.g., $5 off)'),
      value: z.number().min(0).describe('Discount value (percentage 0-100 or fixed amount in store currency)'),
      minOrderAmount: z.number().min(0).optional().describe('Minimum order amount required to use this discount'),
      maxUses: z.number().int().min(1).optional().describe('Maximum number of times this discount can be used'),
      expiresAt: z.string().optional().describe('Expiration date in ISO 8601 format (e.g., 2026-12-31T23:59:59Z)'),
    },
    async ({ code, type, value, minOrderAmount, maxUses, expiresAt }) => {
      if (!client.hasApiKey) return authError();

      try {
        const discountData: Record<string, unknown> = { code, type, value };
        if (minOrderAmount !== undefined) discountData.minOrderAmount = minOrderAmount;
        if (maxUses !== undefined) discountData.maxUses = maxUses;
        if (expiresAt !== undefined) discountData.expiresAt = expiresAt;

        const data = await client.createDiscount(discountData);
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
          content: [{ type: 'text' as const, text: `Error creating discount: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // --- update_discount (auth required) ---
  server.tool(
    'update_discount',
    'Update an existing discount code in your Karrito store. Requires KARRITO_API_KEY environment variable.',
    {
      id: z.string().describe('Discount ID to update'),
      code: z.string().min(1).max(50).optional().describe('New discount code'),
      type: z.enum(['percentage', 'fixed']).optional().describe('New discount type'),
      value: z.number().min(0).optional().describe('New discount value'),
      minOrderAmount: z.number().min(0).optional().describe('New minimum order amount'),
      maxUses: z.number().int().min(1).optional().describe('New maximum uses'),
      expiresAt: z.string().optional().describe('New expiration date in ISO 8601 format'),
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
            content: [{ type: 'text' as const, text: 'No fields to update. Provide at least one field (code, type, value, minOrderAmount, maxUses, expiresAt).' }],
            isError: true,
          };
        }

        const data = await client.updateDiscount(id, updateData);
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
          content: [{ type: 'text' as const, text: `Error updating discount: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // --- delete_discount (auth required) ---
  server.tool(
    'delete_discount',
    'Delete a discount code from your Karrito store. Requires KARRITO_API_KEY environment variable.',
    {
      id: z.string().describe('Discount ID to delete'),
    },
    async ({ id }) => {
      if (!client.hasApiKey) return authError();

      try {
        const data = await client.deleteDiscount(id);
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
          content: [{ type: 'text' as const, text: `Error deleting discount: ${message}` }],
          isError: true,
        };
      }
    }
  );
}
