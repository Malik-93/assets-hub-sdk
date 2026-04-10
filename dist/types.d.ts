export interface Project {
    id: string;
    name: string;
}
export interface Asset {
    id: string;
    name: string;
    mimeType: string;
    url: string;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}
export interface ClientConfig {
    baseUrl: string;
    apiKey?: string;
}
export interface UploadOptions {
    folderId?: string;
    name?: string;
}
