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
  // --- list_reviews (auth required) ---
  server.tool(
    'list_reviews',
    'List product reviews in your Karrito store. Can filter by moderation status. Requires KARRITO_API_KEY environment variable.',
    {
      limit: z.number().min(1).max(100).default(20).describe('Max reviews to return (1-100)'),
      offset: z.number().min(0).default(0).describe('Pagination offset'),
      status: z
        .enum(['pending', 'approved', 'rejected'])
        .optional()
        .describe('Filter by moderation status'),
    },
    async ({ limit, offset, status }) => {
      if (!client.hasApiKey) return authError();

      try {
        const data = await client.listReviews(limit, offset, status);
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
          content: [{ type: 'text' as const, text: `Error listing reviews: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // --- moderate_review (auth required) ---
  server.tool(
    'moderate_review',
    'Approve or reject a product review. Approved reviews are visible on the public catalog. Requires KARRITO_API_KEY environment variable.',
    {
      id: z.string().describe('Review ID to moderate'),
      status: z.enum(['approved', 'rejected']).describe('Moderation decision: approved (visible) or rejected (hidden)'),
    },
    async ({ id, status }) => {
      if (!client.hasApiKey) return authError();

      try {
        const data = await client.moderateReview(id, status);
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
          content: [{ type: 'text' as const, text: `Error moderating review: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // --- delete_review (auth required) ---
  server.tool(
    'delete_review',
    'Permanently delete a product review. Requires KARRITO_API_KEY environment variable.',
    {
      id: z.string().describe('Review ID to delete'),
    },
    async ({ id }) => {
      if (!client.hasApiKey) return authError();

      try {
        const data = await client.deleteReview(id);
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
          content: [{ type: 'text' as const, text: `Error deleting review: ${message}` }],
          isError: true,
        };
      }
    }
  );
}
