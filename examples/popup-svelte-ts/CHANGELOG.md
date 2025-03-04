# bedframe-svelte

## 0.0.1

### Patch Changes

- 7f8128b: add temp legacy config.

  ```
  legacy: {
    skipWebSocketTokenCheck: true,
  },
  ```

  Temporary workaround for upstream (crxjs) issue:
  change to Vite CORS policies in the dev server:

  "
  In Vite 6.0.8 and below, WebSocket server was able to connect from any web pages. However,
  that could be exploited by a malicious web page.

  In Vite 6.0.9+, the WebSocket server now requires a token to connect from a web page.
  But this may break some plugins and frameworks that connects to the WebSocket server
  on their own. Enabling this option will make Vite skip the token check.

  We do not recommend enabling this option unless you are sure that you are fine with
  that security weakness.
  "

  ^^^

  - https://github.com/crxjs/chrome-extension-tools/issues/971#issuecomment-2605520184
  - https://github.com/vitejs/vite/blob/9654348258eaa0883171533a2b74b4e2825f5fb6/packages/vite/src/node/config.ts#L535
