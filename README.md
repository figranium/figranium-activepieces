# @figranium/piece

Official Activepieces piece for integrating Figranium browser automation into workflows.

## Actions

- Execute Task
- List Tasks
- List Executions
- List Schedules
- Get Schedule Status
- Get Scheduler Status
- Set Schedule
- Delete Schedule
- Describe Schedule
- Custom API Call

## Authentication

Connect using your Figranium base URL and API key.

## Publishing

Releases are published to npm through GitHub Actions using npm Trusted Publishing and provenance. Configure the trusted publisher on npm for:

- Organization/user: `figranium`
- Repository: `figranium-activepieces`
- Workflow: `publish.yml`

Then bump the package version and push a matching `v*` tag.

## License

MIT
