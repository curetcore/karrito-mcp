import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { KarritoApiClient } from '../lib/api-client.js';

export function register(server: McpServer, client: KarritoApiClient): void {
  // --- list_my_products (auth required) ---
  server.tool(
    'list_my_products',
    'List products in your Karrito catalog. Requires KARRITO_API_KEY environment variable.',
    {
      limit: z.number().min(1).max(100).default(50).describe('Max products to return (1-100)'),
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
        const data = await client.listProducts(limit, offset);
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
          content: [{ type: 'text' as const, text: `Error listing products: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // --- create_product (auth required) ---
  server.tool(
    'create_product',
    'Create a new product in your Karrito catalog. Requires KARRITO_API_KEY environment variable.',
    {
      name: z.string().min(1).max(200).describe('Product name'),
      price: z.number().min(0).describe('Product price in store currency'),
      description: z.string().max(2000).optional().describe('Product description'),
      categoryId: z.string().optional().describe('Category ID to assign the product to'),
      imageUrl: z.string().url().optional().describe('Product image URL'),
    },
    async ({ name, price, description, categoryId, imageUrl }) => {
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
        const productData: Record<string, unknown> = { name, price };
        if (description) productData.description = description;
        if (categoryId) productData.categoryId = categoryId;
        if (imageUrl) productData.imageUrl = imageUrl;

        const data = await client.createProduct(productData);
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
          content: [{ type: 'text' as const, text: `Error creating product: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // --- update_product (auth required) ---
  server.tool(
    'update_product',
    'Update an existing product in your Karrito catalog. Requires KARRITO_API_KEY environment variable.',
    {
      id: z.string().describe('Product ID to update'),
      name: z.string().min(1).max(200).optional().describe('New product name'),
      price: z.number().min(0).optional().describe('New price in store currency'),
      description: z.string().max(2000).optional().describe('New product description'),
      categoryId: z.string().optional().describe('New category ID'),
      comparePrice: z.number().min(0).optional().describe('Compare-at price (must be > price)'),
      isActive: z.boolean().optional().describe('Whether the product is active'),
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
            content: [{ type: 'text' as const, text: 'No fields to update. Provide at least one field (name, price, description, categoryId, comparePrice, isActive).' }],
            isError: true,
          };
        }

        const data = await client.updateProduct(id, updateData);
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
          content: [{ type: 'text' as const, text: `Error updating product: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // --- delete_product (auth required) ---
  server.tool(
    'delete_product',
    'Delete a product from your Karrito catalog (soft delete). Requires KARRITO_API_KEY environment variable.',
    {
      id: z.string().describe('Product ID to delete'),
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
        const data = await client.deleteProduct(id);
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
          content: [{ type: 'text' as const, text: `Error deleting product: ${message}` }],
          isError: true,
        };
      }
    }
  );
}
