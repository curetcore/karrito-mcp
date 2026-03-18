import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const CURRENCIES_DATA = {
  supported: [
    { code: 'DOP', name: 'Peso dominicano', symbol: 'RD$', country: 'Republica Dominicana', decimalPlaces: 2 },
    { code: 'MXN', name: 'Peso mexicano', symbol: '$', country: 'Mexico', decimalPlaces: 2 },
    { code: 'COP', name: 'Peso colombiano', symbol: '$', country: 'Colombia', decimalPlaces: 0 },
    { code: 'ARS', name: 'Peso argentino', symbol: '$', country: 'Argentina', decimalPlaces: 2 },
    { code: 'CLP', name: 'Peso chileno', symbol: '$', country: 'Chile', decimalPlaces: 0 },
    { code: 'USD', name: 'US Dollar', symbol: '$', country: 'United States / International', decimalPlaces: 2 },
  ],
  default: 'DOP',
  notes: 'Currency is set per store. Prices display with the local symbol and formatting. No currency conversion is performed — sellers set prices in their local currency.',
};

export function register(server: McpServer): void {
  server.resource(
    'currencies',
    'karrito://currencies',
    {
      description: 'Supported currencies in Karrito — 6 LATAM currencies with formatting details',
      mimeType: 'application/json',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(CURRENCIES_DATA, null, 2),
          mimeType: 'application/json',
        },
      ],
    })
  );
}
