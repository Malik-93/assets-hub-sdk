# Asset Hub Client SDK

A lightweight, cross-platform TypeScript SDK for interacting with the Asset Management service. Supports React (Web) and Expo/React Native (Mobile).

## Installation

### From GitHub
```bash
npm install Malik-93/assets-hub-sdk
# OR
yarn add Malik-93/assets-hub-sdk
```

## Initialization

You can initialize the client by simply passing your configuration. The `baseUrl` is managed automatically using a 3-tier priority system.

### Option 1: Zero Configuration (Recommended)
If the SDK was built with a default URL or if you have environment variables set, you can initialize with an empty object (or just your API key).

```typescript
import { AssetHubClient } from '@assethub/client-sdk';

// Automatically picks up the injected or environment base URL
const client = new AssetHubClient({});
```

### Option 2: Manual Configuration
```typescript
const client = new AssetHubClient({
  baseUrl: 'https://your-server-url.com',
  apiKey: 'your-generated-api-key', // Essential for multi-tenant isolation
});
```

## Multi-Tenant Isolation (Important)

The Asset Hub now uses a database-backed API key system. Every API key is linked to a specific **Root Folder ID** on Google Drive. 

- When you use an API key, the SDK will only interact with the assets and folders inside that specific client's root folder.
- Requests without a valid key will be rejected with a `401 Unauthorized` error.
- You can generate and manage these keys via the Asset Hub Dashboard or directly through this SDK using the management methods below.

## Configuration & Security

The SDK resolves the `baseUrl` using the following priority:
1. **Explicit Config**: `baseUrl` passed in the constructor.
2. **Environment Variables**: `ASSET_HUB_BASE_URL` or `NEXT_PUBLIC_ASSET_HUB_BASE_URL`.
3. **Build-time Injection**: A default URL "baked" into the package via GitHub Secrets.

### GitHub Secrets Setup
To avoid exposing your server URL in source code, you can use GitHub Secrets in your repository:
1. Go to **Settings > Secrets and variables > Actions**.
2. Create a secret named `ASSET_HUB_BASE_URL`.
3. The build process will automatically inject this URL into the final package.

## Usage Examples

### 1. List Projects
```typescript
const projects = await client.listProjects();
console.log(projects);
```

### 2. Upload Asset (Web)
```typescript
const handleUpload = async (file: File) => {
  const asset = await client.uploadAsset(file, { folderId: 'folder-id' });
  console.log('Uploaded:', asset.url);
};
```

### 3. Upload Asset (React Native / Expo)
```typescript
import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    const file = {
      uri: result.assets[0].uri,
      name: 'upload.jpg',
      type: 'image/jpeg',
    };
    const asset = await client.uploadAsset(file);
    console.log('Mobile Upload Success:', asset.url);
  }
};
```

### 4. Delete Asset
```typescript
await client.deleteAsset('asset-id');
```

## API Reference

### `AssetHubClient`

- `listProjects()`: Returns all folders.
- `createProject(name)`: Creates a new folder.
- `renameProject(id, name)`: Renames a folder.
- `deleteProject(id)`: Deletes a folder and all contents.
- `listAssets({ folderId })`: List files.
- `uploadAsset(file, options)`: Uploads a file.
- `deleteAsset(id)`: Deletes a file.
- `getAssetUrl(id)`: Returns the proxied download URL.

