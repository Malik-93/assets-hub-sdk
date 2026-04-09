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

```typescript
import { AssetHubClient } from '@assethub/client-sdk';

const client = new AssetHubClient({
  baseUrl: 'https://your-server-url.com',
});
```

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
