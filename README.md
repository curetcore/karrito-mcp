# karrito-mcp

MCP server for [Karrito](https://karrito.shop) — the digital catalog builder for WhatsApp sellers in LATAM.

Connect your AI assistant (Claude, Cursor, Windsurf) to Karrito and manage your entire store — products, orders, discounts, reviews, shipping, analytics — without leaving your editor.

## Installation

### Quick start (npx)

```bash
npx karrito-mcp
```

### Claude Code

```bash
claude mcp add karrito -- npx karrito-mcp
```

### Claude Desktop (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "karrito": {
      "command": "npx",
      "args": ["karrito-mcp"],
      "env": {
        "KARRITO_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "karrito": {
    "command": "npx",
    "args": ["karrito-mcp"],
    "env": {
      "KARRITO_API_KEY": "your-api-key-here"
    }
  }
}
```

## Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `KARRITO_API_KEY` | For authenticated tools | Your Karrito API key from [Settings > API](https://karrito.shop/settings/api) |
| `KARRITO_API_URL` | No | Custom API URL (default: `https://karrito.shop`) |

## Resources (5)

Static data about Karrito — no authentication required.

| Resource | URI | Description |
|----------|-----|-------------|
| Pricing | `karrito://pricing` | Plans, prices, and features comparison |
| Features | `karrito://features` | Complete feature list (core, pro, upcoming) |
| Niches | `karrito://niches` | All 50 available store niches |
| Competitors | `karrito://competitors` | 19 competitors compared with Karrito advantages |
| Currencies | `karrito://currencies` | 6 supported LATAM currencies |

## Tools (30)

### Public (no auth required)

| Tool | Description |
|------|-------------|
| `search_catalogs` | Search public catalogs by keyword |
| `get_niche_info` | Get info about a specific niche |

### Products (auth required)

| Tool | Description |
|------|-------------|
| `list_my_products` | List products in your catalog |
| `create_product` | Create a new product |
| `update_product` | Update an existing product |
| `delete_product` | Delete a product (soft delete) |

### Categories (auth required)

| Tool | Description |
|------|-------------|
| `list_categories` | List categories in your store |
| `create_category` | Create a new category |
| `update_category` | Update an existing category |
| `delete_category` | Delete a category |

### Orders (auth required)

| Tool | Description |
|------|-------------|
| `list_my_orders` | List orders with optional status filter |
| `get_order` | Get detailed order info |
| `update_order_status` | Change order status (confirm, ship, deliver, cancel) |

### Store (auth required)

| Tool | Description |
|------|-------------|
| `get_my_store` | Get store info (name, slug, currency, stats) |
| `update_store` | Update store settings (name, WhatsApp, currency, etc.) |
| `toggle_publish` | Quickly publish or unpublish your store |

### Discounts (auth required)

| Tool | Description |
|------|-------------|
| `list_discounts` | List discount codes |
| `create_discount` | Create a discount code (percentage or fixed) |
| `update_discount` | Update an existing discount |
| `delete_discount` | Delete a discount code |

### Reviews (auth required)

| Tool | Description |
|------|-------------|
| `list_reviews` | List reviews with optional status filter |
| `moderate_review` | Approve or reject a review |
| `delete_review` | Permanently delete a review |

### Customers (auth required)

| Tool | Description |
|------|-------------|
| `list_customers` | List customers who have ordered |
| `get_customer` | Get customer detail with order history |

### Analytics (auth required)

| Tool | Description |
|------|-------------|
| `get_analytics` | Store stats: orders, revenue, products, customers, AOV, popular products |

### Shipping (auth required)

| Tool | Description |
|------|-------------|
| `list_shipping_options` | List shipping options |
| `create_shipping_option` | Create a shipping option (delivery, pickup, express) |
| `update_shipping_option` | Update a shipping option |
| `delete_shipping_option` | Delete a shipping option |

## Usage examples

### Browse public catalogs

> "Search for bakery catalogs on Karrito"

The assistant will use `search_catalogs` with query "bakery" to find matching stores.

### Explore niches

> "What niches does Karrito support for food businesses?"

The assistant will use `get_niche_info` to search food-related niches.

### Manage your catalog

> "List all my products and add a new one called 'Chocolate Cake' at $15"

The assistant will use `list_my_products` and `create_product` (requires `KARRITO_API_KEY`).

### Manage orders

> "Show me all pending orders and confirm the first one"

The assistant will use `list_my_orders` with status filter and `update_order_status`.

### Create discounts

> "Create a 20% discount code VERANO20 that expires on December 31"

The assistant will use `create_discount` with the provided parameters.

### Moderate reviews

> "Show me pending reviews and approve the ones with 4+ stars"

The assistant will use `list_reviews` with status "pending" and `moderate_review`.

### Get analytics

> "How is my store performing? Show me the stats"

The assistant will use `get_analytics` to retrieve store metrics.

### Compare platforms

> "How does Karrito compare to Shopify and TiendaNube?"

The assistant will read the `karrito://competitors` resource.

## Development

```bash
git clone https://github.com/curetcore/karrito-mcp
cd karrito-mcp
npm install
npm run dev
```

## License

MIT
