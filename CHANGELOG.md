# Changelog

All notable changes to karrito-mcp will be documented in this file.

## [2.0.2] - 2026-03-18

### Fixed
- Improved error messages for invalid API keys

## [2.0.0] - 2026-03-18

### Added
- 30 tools across 10 domains (products, categories, orders, discounts, reviews, customers, store, shipping, analytics, public catalog)
- 5 static resources (pricing, features, niches, competitors, currencies)
- Zod validation on all tool inputs
- `context7.json` for Context7 indexing

### Changed
- Migrated from v1 (5 tools) to v2 architecture
- All tools now use structured Zod schemas

## [1.0.0] - 2026-03-17

### Added
- Initial release with 5 basic tools
- Published on npm as `karrito-mcp`
