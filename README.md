# Asset Hub Client SDK

A lightweight, cross-platform TypeScript SDK for interacting with the Asset Management service. Supports React (Web) and Expo/React Native (Mobile).

## Installation

### From GitHub
```bash
npm install Malik-93/assets-hub-sdk
# OR
yarn add Malik-93/assets-hub-sdk
```

## Local Development Workflow

Since GitHub Actions may be unavailable, this SDK uses a **Local Secret Injection** system. This ensures that the production building process is automated and secure.

### 1. Setup
Create a `.env` file in the root of the project:
```env
ASSET_HUB_BASE_URL=https://your-server-url.com
```

### 2. Automatic Build & Injection
The project is configured to automatically:
1.  Inject the URL from your `.env` into the code.
2.  Build the project (`dist/` folder).
3.  Revert your source code (`src/` folder) back to its clean state.

This happens automatically:
*   **On Push**: A Git Hook runs `npm run build` whenever you `git push`.
*   **On Publish**: `npm publish` triggers the `prepare` script.
*   **Manually**: Run `npm run build`.

### 3. Security
Your server URL is **never** committed to Git. The `scripts/inject-secrets.js` script ensures that only the compiled files in `dist/` contain the real URL, while `src/client.ts` remains clean with a placeholder.

## Initialization

You can initialize the client by simply passing your configuration. The `baseUrl` is managed automatically using a 3-tier priority system.

### Option 1: Zero Configuration (Recommended)
If the SDK was built with a default URL or if you have environment variables set, you can initialize with an empty object (or just your API key).

```typescript
import { AssetHubClient } from '@assethub/client-sdk';

// Automatically picks up the injected or environment base URL
const client = new AssetHubClient({
  apiKey: 'your-generated-api-key'
});
```

### Option 2: Manual Configuration
```typescript
const client = new AssetHubClient({
  baseUrl: 'https://your-server-url.com',
  apiKey: 'your-generated-api-key', // Essential for multi-tenant isolation
});
```

## Multi-Tenant Isolation (Important)

The Asset Hub uses a database-backed API key system. Every API key is **uniquely linked to a specific Folder ID** on Google Drive. 

- When you use an API key, the SDK defaults to interacting with assets inside that specific folder.
- **No Manual Mapping Required**: You no longer need to pass a `rootFolderId` or `folderId` for top-level operations. The backend automatically identifies the target folder from your `apiKey`.
- Requests without a valid key will be rejected with a `401 Unauthorized` error.

## Usage Examples

### 1. List Sub-Folders
```typescript
const folders = await client.listFolders();
console.log(folders);
```

### 2. List Assets (Default Folder)
```typescript
// Lists all assets in the folder linked to your API key
const assets = await client.listAssets();
```

### 3. Upload Asset (Standard Web / Mobile)
```typescript
// Uploads directly to the folder linked to your API key
const asset = await client.uploadAsset(file);
console.log('Uploaded:', asset.url);
```

### 4. Upload to a Specific Sub-Folder
```typescript
const asset = await client.uploadAsset(file, { folderId: 'sub-folder-id' });
```

### 5. Delete Asset
```typescript
await client.deleteAsset('asset-id');
```

## API Reference

### `AssetHubClient`

- `listFolders()`: Returns all sub-folders within the client's root.
- `createFolder(name)`: Creates a new sub-folder.
- `renameFolder(id, name)`: Renames a folder.
- `deleteFolder(id)`: Deletes a folder and all contents.
- `listAssets({ folderId })`: List files.
- `uploadAsset(file, options)`: Uploads a file.
- `deleteAsset(id)`: Deletes a file.
- `getAssetUrl(id)`: Returns the proxied download URL.

