import { Asset, ClientConfig, Project, UploadOptions } from './types';
export declare class AssetHubClient {
    private baseUrl;
    private apiKey?;
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
}
