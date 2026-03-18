# Security Policy

## Reporting a vulnerability

If you discover a security vulnerability, please report it responsibly:

**Email:** security@karrito.shop

Do NOT open a public issue for security vulnerabilities.

We will respond within 48 hours and work with you to resolve the issue before any public disclosure.

## Supported versions

| Version | Supported |
|---------|-----------|
| 2.x     | Yes       |
| < 2.0   | No        |

## Scope

This MCP server is a client that communicates with the Karrito API (`https://karrito.shop/api/v1`). The server itself does not store data, credentials are passed via environment variables, and all API communication uses HTTPS.
