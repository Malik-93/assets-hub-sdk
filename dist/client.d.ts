import { Asset, ClientConfig, Project, UploadOptions } from './types';
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
    listProjects(): Promise<Project[]>;
    createProject(name: string): Promise<Project>;
    renameProject(id: string, name: string): Promise<Project>;
    deleteProject(id: string): Promise<void>;
    listAssets(options?: {
        folderId?: string;
    }): Promise<Asset[]>;
    /**
     * Upload an asset.
     * Supports Web (File/Blob) and React Native ({ uri, type, name })
     */
    uploadAsset(file: any, options?: UploadOptions): Promise<Asset>;
    deleteAsset(id: string): Promise<void>;
    /**
     * Helper to get the absolute proximity URL for an asset ID
     */
    getAssetUrl(id: string): string;
    listApiKeys(): Promise<import('./types').ApiKeyRecord[]>;
    generateApiKey(name: string, rootFolderId: string): Promise<import('./types').ApiKeyRecord>;
    deleteApiKey(id: string): Promise<void>;
}
