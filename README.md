# @figranium/piece

Official Activepieces piece for integrating Figranium browser automation into workflows.

## Actions

- Execute Task
- List Tasks
- List Executions
- Custom API Call

## Authentication

Connect using your Figranium base URL and a scoped API key. Grant `tasks:read` to list Tasks and validate the connection, `tasks:run` to execute permitted Tasks, and `results:read` to list permitted execution results. Task allowlists remain enforced by Figranium.

**Schedule administration is not supported by this API-key-only piece.** Figranium v0.21's `/api/schedules/*` endpoints require an authenticated workspace session (`requireAuth`) and reject API keys with HTTP 401. The previously registered schedule actions could not work with this piece's authentication. Configure schedules in the Figranium workspace UI instead. Do not supply workspace session cookies as API keys.

## Authenticated request safety

All built-in actions reject HTTP redirects rather than forwarding `x-api-key` to a redirected destination. The Custom API Call action accepts only the configured server's own `/api/` endpoints (including paths under a reverse-proxy prefix), and redirects cannot be enabled. Older flows with no redirect setting are treated as redirects disabled. Use a separate unauthenticated HTTP action for unrelated URLs.

## Publishing

Releases are published to npm through GitHub Actions using npm Trusted Publishing and provenance. Configure the trusted publisher on npm for:

- Organization/user: `figranium`
- Repository: `figranium-activepieces`
- Workflow: `publish.yml`

Then bump the package version and push a matching `v*` tag.

## License

MIT
