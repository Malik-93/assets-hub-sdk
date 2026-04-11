import { Asset, ClientConfig, Folder, UploadOptions } from './types';
export declare class AssetHubClient {
    private baseUrl;
    private apiKey?;
    /**
     * Initialize the Asset Hub Client.
     * Authentication is required for multi-tenant data isolation.
     *
     * Base URL Priority:
     * 1. Explicit config.baseUrl
     * 2. ASSET_HUB_BASE_URL (Environment variable)
     * 3. Default build-time URL
     *
     * @param config.apiKey Essential for isolation. Get this from the Asset Hub Dashboard.
     */
    constructor(config: ClientConfig);
    private request;
    /**
     * List all folders in the root.
     */
    listFolders(): Promise<Folder[]>;
    /**
     * Create a new folder.
     */
    createFolder(name: string): Promise<Folder>;
    /**
     * Rename a folder.
     */
    renameFolder(id: string, name: string): Promise<Folder>;
    /**
     * Delete a folder and all its contents.
     */
    deleteFolder(id: string): Promise<void>;
    /**
     * List assets.
     * @param options.folderId Optional. If not provided, lists assets in the folder linked to the API key.
     */
    listAssets(options?: {
        folderId?: string;
    }): Promise<Asset[]>;
    /**
     * Upload an asset.
     * Supports Web (File/Blob) and React Native ({ uri, type, name })
     * @param file The file to upload.
     * @param options.folderId Optional. If not provided, uploads to the folder linked to the API key.
     */
    uploadAsset(file: any, options?: UploadOptions): Promise<Asset>;
    deleteAsset(id: string): Promise<void>;
    /**
     * Helper to get the absolute proximity URL for an asset ID
     */
    getAssetUrl(id: string): string;
}
