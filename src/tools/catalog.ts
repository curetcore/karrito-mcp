import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { KarritoApiClient } from '../lib/api-client.js';
import { NICHES_DATA } from '../resources/niches.js';

export function register(server: McpServer, client: KarritoApiClient): void {
  // --- search_catalogs (public, no auth) ---
  server.tool(
    'search_catalogs',
    'Search public Karrito catalogs by keyword. No authentication required.',
    {
      query: z.string().min(1).max(100).describe('Search query — store name, product, or niche'),
    },
    async ({ query }) => {
      try {
        const data = await client.searchCatalogs(query);
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
          content: [{ type: 'text' as const, text: `Error searching catalogs: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // --- get_niche_info (public, static data) ---
  server.tool(
    'get_niche_info',
    'Get information about a specific Karrito niche by slug or name. Returns niche details from the 50 available niches. No authentication required.',
    {
      niche: z.string().min(1).max(50).describe('Niche slug (e.g., "reposteria") or partial name to search'),
    },
    async ({ niche }) => {
      const query = niche.toLowerCase();

      // Busqueda exacta por slug
      const exactMatch = NICHES_DATA.find((n) => n.slug === query);
      if (exactMatch) {
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(exactMatch, null, 2),
            },
          ],
        };
      }

      // Busqueda parcial por nombre o descripcion
      const partialMatches = NICHES_DATA.filter(
        (n) =>
          n.slug.includes(query) ||
          n.name.toLowerCase().includes(query) ||
          n.description.toLowerCase().includes(query)
      );

      if (partialMatches.length === 0) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `No niches found matching "${niche}". Use the karrito://niches resource to see all 50 available niches.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              { matches: partialMatches, total: partialMatches.length },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
