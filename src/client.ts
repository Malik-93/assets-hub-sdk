import fetch from 'cross-fetch';
import { Asset, ApiResponse, ClientConfig, Folder, UploadOptions } from './types';

const DEFAULT_BASE_URL = "__ASSET_HUB_BASE_URL_PLACEHOLDER__";

export class AssetHubClient {
  private baseUrl: string;
  private apiKey?: string;

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
  constructor(config: ClientConfig) {
    const baseUrl = config.baseUrl || 
                    (typeof process !== 'undefined' ? process.env?.ASSET_HUB_BASE_URL : undefined) || 
                    (typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_ASSET_HUB_BASE_URL : undefined) ||
                    (DEFAULT_BASE_URL.startsWith('http') ? DEFAULT_BASE_URL : undefined);

    if (!baseUrl) {
      throw new Error(
        'AssetHubClient Error: baseUrl is required. Provide it in the config, set ASSET_HUB_BASE_URL, or ensure the SDK was built with a default URL.'
      );
    }

    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    this.apiKey = config.apiKey;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    const response = await fetch(url, { ...options, headers });
    const result: ApiResponse<T> = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Asset Hub API Error');
    }

    return result.data as T;
  }

  // --- Folders ---
  /**
   * List all folders in the root.
   */
  async listFolders(): Promise<Folder[]> {
    return this.request<Folder[]>('/api/assets/folders');
  }

  /**
   * Create a new folder.
   */
  async createFolder(name: string): Promise<Folder> {
    return this.request<Folder>('/api/assets/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
  }

  /**
   * Rename a folder.
   */
  async renameFolder(id: string, name: string): Promise<Folder> {
    return this.request<Folder>(`/api/assets/folders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
  }

  /**
   * Delete a folder and all its contents.
   */
  async deleteFolder(id: string): Promise<void> {
    return this.request<void>(`/api/assets/folders/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Assets ---

  /**
   * List assets.
   * @param options.folderId Optional. If not provided, lists assets in the folder linked to the API key.
   */
  async listAssets(options: { folderId?: string } = {}): Promise<Asset[]> {
    const query = options.folderId ? `?folderId=${options.folderId}` : '';
    return this.request<Asset[]>(`/api/assets${query}`);
  }

  /**
   * Upload an asset.
   * Supports Web (File/Blob) and React Native ({ uri, type, name })
   * @param file The file to upload.
   * @param options.folderId Optional. If not provided, uploads to the folder linked to the API key.
   */
  async uploadAsset(file: any, options: UploadOptions = {}): Promise<Asset> {
    const formData = new FormData();
    
    // Auto-detect file structure for React Native
    if (file && typeof file === 'object' && file.uri) {
      // React Native pattern
      formData.append('asset', file as any);
    } else {
      // Standard Web patterns
      formData.append('asset', file);
    }

    if (options.folderId) {
      formData.append('folderId', options.folderId);
    }

    return this.request<Asset>('/api/assets/upload', {
      method: 'POST',
      body: formData as any,
      // Note: Do not set Content-Type header when using FormData; 
      // fetch will set it correctly with the boundary.
    });
  }

  async deleteAsset(id: string): Promise<void> {
    return this.request<void>(`/api/assets/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Helper to get the absolute proximity URL for an asset ID
   */
  getAssetUrl(id: string): string {
    return `${this.baseUrl}/api/assets/${id}`;
  }
}
