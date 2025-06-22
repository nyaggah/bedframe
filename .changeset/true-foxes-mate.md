---
'@bedframe/cli': patch
---

feat: update Edge Add-ons publishing to use API v1.1

- Replace OAuth token authentication with API key authentication
- Update `EdgeUploadConfig` to use `productId`, `clientId`, and `apiKey`
- Remove deprecated `getEdgeAccessToken` function
- Update API endpoint to use current Microsoft Edge Add-ons API
- Add proper validation for required environment variables
- Improve error handling with specific troubleshooting tips
- Update environment variable names in \_\_env stub file (generated `.env`)
- Add helpful setup instructions for Partner Center configuration
