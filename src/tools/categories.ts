import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { KarritoApiClient } from '../lib/api-client.js';

export function register(server: McpServer, client: KarritoApiClient): void {
  // --- list_categories (auth required) ---
  server.tool(
    'list_categories',
    'List categories in your Karrito store. Requires KARRITO_API_KEY environment variable.',
    {
      limit: z.number().min(1).max(100).default(50).describe('Max categories to return (1-100)'),
      offset: z.number().min(0).default(0).describe('Pagination offset'),
    },
    async ({ limit, offset }) => {
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
        const data = await client.listCategories(limit, offset);
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
          content: [{ type: 'text' as const, text: `Error listing categories: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // --- create_category (auth required) ---
  server.tool(
    'create_category',
    'Create a new category in your Karrito store. Requires KARRITO_API_KEY environment variable.',
    {
      name: z.string().min(1).max(100).describe('Category name'),
      position: z.number().int().min(0).optional().describe('Sort order (lower = first)'),
    },
    async ({ name, position }) => {
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
        const categoryData: Record<string, unknown> = { name };
        if (position !== undefined) categoryData.position = position;

        const data = await client.createCategory(categoryData);
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
          content: [{ type: 'text' as const, text: `Error creating category: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // --- update_category (auth required) ---
  server.tool(
    'update_category',
    'Update an existing category in your Karrito store. Requires KARRITO_API_KEY environment variable.',
    {
      id: z.string().describe('Category ID to update'),
      name: z.string().min(1).max(100).optional().describe('New category name'),
      position: z.number().int().min(0).optional().describe('New sort order (lower = first)'),
      isActive: z.boolean().optional().describe('Whether the category is active'),
    },
    async ({ id, ...updates }) => {
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
            content: [{ type: 'text' as const, text: 'No fields to update. Provide at least one field (name, position, isActive).' }],
            isError: true,
          };
        }

        const data = await client.updateCategory(id, updateData);
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
          content: [{ type: 'text' as const, text: `Error updating category: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // --- delete_category (auth required) ---
  server.tool(
    'delete_category',
    'Delete a category from your Karrito store. Products in this category will become uncategorized. Requires KARRITO_API_KEY environment variable.',
    {
      id: z.string().describe('Category ID to delete'),
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
        const data = await client.deleteCategory(id);
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
          content: [{ type: 'text' as const, text: `Error deleting category: ${message}` }],
          isError: true,
        };
      }
    }
  );
}
