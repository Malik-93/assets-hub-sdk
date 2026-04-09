import fetch from 'cross-fetch';
import { Asset, ApiResponse, ClientConfig, Project, UploadOptions } from './types';

export class AssetHubClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(config: ClientConfig) {
    this.baseUrl = config.baseUrl.endsWith('/') ? config.baseUrl.slice(0, -1) : config.baseUrl;
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

  // --- Projects ---

  async listProjects(): Promise<Project[]> {
    return this.request<Project[]>('/api/assets/projects');
  }

  async createProject(name: string): Promise<Project> {
    return this.request<Project>('/api/assets/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
  }

  async renameProject(id: string, name: string): Promise<Project> {
    return this.request<Project>(`/api/assets/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
  }

  async deleteProject(id: string): Promise<void> {
    return this.request<void>(`/api/assets/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Assets ---

  async listAssets(options: { folderId?: string } = {}): Promise<Asset[]> {
    const query = options.folderId ? `?folderId=${options.folderId}` : '';
    return this.request<Asset[]>(`/api/assets${query}`);
  }

  /**
   * Upload an asset.
   * Supports Web (File/Blob) and React Native ({ uri, type, name })
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
