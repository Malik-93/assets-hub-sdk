"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetHubClient = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
class AssetHubClient {
    constructor(config) {
        this.baseUrl = config.baseUrl.endsWith('/') ? config.baseUrl.slice(0, -1) : config.baseUrl;
        this.apiKey = config.apiKey;
    }
    async request(path, options = {}) {
        const url = `${this.baseUrl}${path}`;
        const headers = {
            ...options.headers,
        };
        if (this.apiKey) {
            headers['X-API-Key'] = this.apiKey;
        }
        const response = await (0, cross_fetch_1.default)(url, { ...options, headers });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Asset Hub API Error');
        }
        return result.data;
    }
    // --- Projects ---
    async listProjects() {
        return this.request('/api/assets/projects');
    }
    async createProject(name) {
        return this.request('/api/assets/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
    }
    async renameProject(id, name) {
        return this.request(`/api/assets/projects/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
    }
    async deleteProject(id) {
        return this.request(`/api/assets/projects/${id}`, {
            method: 'DELETE',
        });
    }
    // --- Assets ---
    async listAssets(options = {}) {
        const query = options.folderId ? `?folderId=${options.folderId}` : '';
        return this.request(`/api/assets${query}`);
    }
    /**
     * Upload an asset.
     * Supports Web (File/Blob) and React Native ({ uri, type, name })
     */
    async uploadAsset(file, options = {}) {
        const formData = new FormData();
        // Auto-detect file structure for React Native
        if (file && typeof file === 'object' && file.uri) {
            // React Native pattern
            formData.append('asset', file);
        }
        else {
            // Standard Web patterns
            formData.append('asset', file);
        }
        if (options.folderId) {
            formData.append('folderId', options.folderId);
        }
        return this.request('/api/assets/upload', {
            method: 'POST',
            body: formData,
            // Note: Do not set Content-Type header when using FormData; 
            // fetch will set it correctly with the boundary.
        });
    }
    async deleteAsset(id) {
        return this.request(`/api/assets/${id}`, {
            method: 'DELETE',
        });
    }
    /**
     * Helper to get the absolute proximity URL for an asset ID
     */
    getAssetUrl(id) {
        return `${this.baseUrl}/api/assets/${id}`;
    }
}
exports.AssetHubClient = AssetHubClient;
