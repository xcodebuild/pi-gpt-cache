# pi-gpt-cache

A [Pi](https://pi.dev/) package that improves OpenAI Responses API prompt caching by adding `prompt_cache_key` to OpenAI provider requests.

## What it does

This package registers a Pi extension that overrides the existing `openai` provider's `openai-responses` streaming implementation. It keeps Pi's built-in OpenAI models, delegates request handling to Pi's built-in `streamSimpleOpenAIResponses`, and injects `prompt_cache_key` into the final Responses API payload.

The cache key is Pi's `options.sessionId`, matching the Codex client's default behavior of deriving `promptCacheKey` from the session ID. Requests from the same Pi session can share OpenAI prompt-cache affinity. If another hook already sets `prompt_cache_key`, this extension leaves that value unchanged.

## Installation

Install as a Pi package:

```sh
pi install npm:pi-gpt-cache
```

For a project-local install:

```sh
pi install -l npm:pi-gpt-cache
```

To test directly from a checkout before publishing:

```sh
pi -e ./extensions/openai-responses-prompt-cache.ts
# or
pi install ./path/to/pi-gpt-cache
```

## Configuration

No configuration is required. The prompt cache key always comes from the Pi session id.

## Repository layout

- `extensions/openai-responses-prompt-cache.ts` - npm package extension entrypoint included in the published tarball.
- `.pi/extensions/openai-responses-prompt-cache.ts` - project-local copy for this repository, useful while developing in-place.

## How it works

The extension calls:

```ts
pi.registerProvider("openai", {
  api: "openai-responses",
  streamSimple(...) {
    // delegates to streamSimpleOpenAIResponses(...)
    // and adds prompt_cache_key to the payload
  },
});
```

Because the provider override does not define `models`, Pi preserves its existing OpenAI model list and only replaces the streaming implementation.

## Development

Preview the npm package contents:

```sh
npm run pack:dry-run
```

Publish when ready:

```sh
npm publish
```

Make sure the package name in `package.json` is available on npm, or rename it before publishing.

## License

MIT
