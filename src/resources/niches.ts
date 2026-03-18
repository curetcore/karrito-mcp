import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export const NICHES_DATA = [
  { slug: 'reposteria', name: 'Reposteria', description: 'Cakes, cupcakes, cookies, and custom desserts', emoji: 'cake' },
  { slug: 'comida-casera', name: 'Comida casera', description: 'Home-cooked meals, meal prep, and lunch delivery', emoji: 'pot' },
  { slug: 'ropa-mujer', name: 'Ropa de mujer', description: 'Women\'s clothing, dresses, accessories', emoji: 'dress' },
  { slug: 'ropa-hombre', name: 'Ropa de hombre', description: 'Men\'s clothing, streetwear, casual wear', emoji: 'shirt' },
  { slug: 'zapatos', name: 'Zapatos', description: 'Sneakers, heels, sandals, boots', emoji: 'shoe' },
  { slug: 'cosmeticos', name: 'Cosmeticos', description: 'Makeup, skincare, beauty products', emoji: 'lipstick' },
  { slug: 'joyeria', name: 'Joyeria', description: 'Handmade jewelry, earrings, necklaces, bracelets', emoji: 'ring' },
  { slug: 'accesorios', name: 'Accesorios', description: 'Phone cases, bags, sunglasses, watches', emoji: 'bag' },
  { slug: 'plantas', name: 'Plantas', description: 'Indoor plants, succulents, pots, and gardening supplies', emoji: 'plant' },
  { slug: 'velas-aromas', name: 'Velas y aromas', description: 'Scented candles, essential oils, diffusers', emoji: 'candle' },
  { slug: 'artesanias', name: 'Artesanias', description: 'Handmade crafts, pottery, macrame, woodwork', emoji: 'art' },
  { slug: 'mascotas', name: 'Mascotas', description: 'Pet food, accessories, toys, grooming', emoji: 'paw' },
  { slug: 'fitness', name: 'Fitness', description: 'Supplements, workout gear, activewear', emoji: 'dumbbell' },
  { slug: 'tecnologia', name: 'Tecnologia', description: 'Gadgets, phone accessories, cables, chargers', emoji: 'phone' },
  { slug: 'papeleria', name: 'Papeleria', description: 'Stationery, notebooks, planners, stickers', emoji: 'pencil' },
  { slug: 'jugos-batidos', name: 'Jugos y batidos', description: 'Fresh juices, smoothies, acai bowls', emoji: 'cup' },
  { slug: 'panaderia', name: 'Panaderia', description: 'Bread, pastries, empanadas, pan de bono', emoji: 'bread' },
  { slug: 'cafeteria', name: 'Cafeteria', description: 'Specialty coffee, beans, brewing equipment', emoji: 'coffee' },
  { slug: 'snacks', name: 'Snacks', description: 'Chips, nuts, dried fruit, candy, chocolates', emoji: 'candy' },
  { slug: 'helados', name: 'Helados', description: 'Ice cream, paletas, frozen yogurt', emoji: 'icecream' },
  { slug: 'salsas-condimentos', name: 'Salsas y condimentos', description: 'Hot sauce, seasonings, marinades', emoji: 'bottle' },
  { slug: 'bebidas', name: 'Bebidas', description: 'Craft beverages, kombucha, agua fresca', emoji: 'drink' },
  { slug: 'bebe', name: 'Bebe', description: 'Baby clothing, toys, accessories, diapers', emoji: 'baby' },
  { slug: 'hogar', name: 'Hogar', description: 'Home decor, kitchenware, organization', emoji: 'home' },
  { slug: 'limpieza', name: 'Limpieza', description: 'Eco cleaning products, detergents, supplies', emoji: 'spray' },
  { slug: 'farmacia', name: 'Farmacia', description: 'OTC medicine, vitamins, health supplies', emoji: 'pill' },
  { slug: 'electrónica', name: 'Electronica', description: 'Electronics, components, repairs', emoji: 'chip' },
  { slug: 'ferreteria', name: 'Ferreteria', description: 'Hardware, tools, construction materials', emoji: 'hammer' },
  { slug: 'libreria', name: 'Libreria', description: 'Books, e-books, educational materials', emoji: 'book' },
  { slug: 'deportes', name: 'Deportes', description: 'Sports equipment, jerseys, outdoor gear', emoji: 'ball' },
  { slug: 'musica', name: 'Musica', description: 'Instruments, vinyl, music accessories', emoji: 'guitar' },
  { slug: 'fotografia', name: 'Fotografia', description: 'Photography prints, frames, camera gear', emoji: 'camera' },
  { slug: 'flores', name: 'Flores', description: 'Flower arrangements, bouquets, event decor', emoji: 'flower' },
  { slug: 'eventos', name: 'Eventos', description: 'Party supplies, decorations, invitations', emoji: 'balloon' },
  { slug: 'regalos', name: 'Regalos', description: 'Gift boxes, personalized gifts, hampers', emoji: 'gift' },
  { slug: 'imprenta', name: 'Imprenta', description: 'Business cards, flyers, banners, signage', emoji: 'printer' },
  { slug: 'uniformes', name: 'Uniformes', description: 'Work uniforms, school uniforms, scrubs', emoji: 'vest' },
  { slug: 'telas', name: 'Telas', description: 'Fabrics, sewing supplies, patterns', emoji: 'scissors' },
  { slug: 'cuidado-personal', name: 'Cuidado personal', description: 'Shampoo, soap, grooming, natural products', emoji: 'soap' },
  { slug: 'suplementos', name: 'Suplementos', description: 'Protein, vitamins, health supplements', emoji: 'supplement' },
  { slug: 'optica', name: 'Optica', description: 'Eyeglasses, contact lenses, sunglasses', emoji: 'glasses' },
  { slug: 'peluqueria', name: 'Peluqueria', description: 'Hair products, tools, salon supplies', emoji: 'hairdryer' },
  { slug: 'tatuajes', name: 'Tatuajes', description: 'Tattoo supplies, aftercare, flash designs', emoji: 'needle' },
  { slug: 'ceramica', name: 'Ceramica', description: 'Handmade ceramics, mugs, plates, vases', emoji: 'vase' },
  { slug: 'bordados', name: 'Bordados', description: 'Embroidery, patches, custom textile art', emoji: 'thread' },
  { slug: 'frutas-verduras', name: 'Frutas y verduras', description: 'Fresh produce, organic fruits, vegetables', emoji: 'apple' },
  { slug: 'carniceria', name: 'Carniceria', description: 'Fresh meat, cuts, sausages, marinated meats', emoji: 'meat' },
  { slug: 'mariscos', name: 'Mariscos', description: 'Fresh seafood, shrimp, fish, ceviche', emoji: 'shrimp' },
  { slug: 'lacteos', name: 'Lacteos', description: 'Cheese, yogurt, milk, artisan dairy', emoji: 'cheese' },
  { slug: 'licores', name: 'Licores', description: 'Wines, spirits, craft beer, mixers', emoji: 'wine' },
];

export function register(server: McpServer): void {
  server.resource(
    'niches',
    'karrito://niches',
    {
      description: 'All 50 available niches for Karrito stores in LATAM — slug, name, and description',
      mimeType: 'application/json',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify({ niches: NICHES_DATA, total: NICHES_DATA.length }, null, 2),
          mimeType: 'application/json',
        },
      ],
    })
  );
}
