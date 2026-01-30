// Cloudinary Upload Widget Integration
// Uses unsigned uploads with upload preset for security

declare global {
    interface Window {
        cloudinary: {
            createUploadWidget: (
                options: CloudinaryUploadOptions,
                callback: (error: Error | null, result: CloudinaryUploadResult) => void
            ) => CloudinaryWidget;
        };
    }
}

interface CloudinaryUploadOptions {
    cloudName: string;
    uploadPreset: string;
    sources?: string[];
    multiple?: boolean;
    maxFiles?: number;
    maxFileSize?: number;
    clientAllowedFormats?: string[];
    cropping?: boolean;
    croppingAspectRatio?: number;
    showSkipCropButton?: boolean;
    folder?: string;
    resourceType?: string;
    styles?: {
        palette?: {
            window?: string;
            sourceBg?: string;
            windowBorder?: string;
            tabIcon?: string;
            inactiveTabIcon?: string;
            menuIcons?: string;
            link?: string;
            action?: string;
            inProgress?: string;
            complete?: string;
            error?: string;
            textDark?: string;
            textLight?: string;
        };
    };
}

interface CloudinaryUploadResult {
    event: 'success' | 'close' | 'queues-end' | 'abort';
    info?: {
        secure_url: string;
        public_id: string;
        original_filename: string;
        format: string;
        width: number;
        height: number;
        bytes: number;
        resource_type: string;
    };
}

interface CloudinaryWidget {
    open: () => void;
    close: () => void;
    destroy: () => void;
}

export interface UploadedImage {
    url: string;
    publicId: string;
    name: string;
    format: string;
    width: number;
    height: number;
    size: number;
}

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dgymjtqil';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'portfolio_uploads';

// Dark theme matching the admin panel
const widgetStyles = {
    palette: {
        window: '#0A0A0A',
        sourceBg: '#141414',
        windowBorder: '#2A2A2A',
        tabIcon: '#D4FF3F',
        inactiveTabIcon: '#666666',
        menuIcons: '#D4FF3F',
        link: '#D4FF3F',
        action: '#D4FF3F',
        inProgress: '#D4FF3F',
        complete: '#22C55E',
        error: '#EF4444',
        textDark: '#0A0A0A',
        textLight: '#FFFFFF',
    },
};

/**
 * Opens Cloudinary upload widget for single image upload
 */
export function uploadImage(options?: {
    folder?: string;
    cropping?: boolean;
    aspectRatio?: number;
}): Promise<UploadedImage> {
    return new Promise((resolve, reject) => {
        if (!window.cloudinary) {
            reject(new Error('Cloudinary widget not loaded'));
            return;
        }

        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: CLOUD_NAME,
                uploadPreset: UPLOAD_PRESET,
                sources: ['local', 'url', 'camera'],
                multiple: false,
                maxFiles: 1,
                maxFileSize: 10000000, // 10MB
                clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
                cropping: options?.cropping ?? true,
                croppingAspectRatio: options?.aspectRatio,
                showSkipCropButton: true,
                folder: options?.folder || 'portfolio',
                resourceType: 'image',
                styles: widgetStyles,
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (result.event === 'success' && result.info) {
                    resolve({
                        url: result.info.secure_url,
                        publicId: result.info.public_id,
                        name: result.info.original_filename,
                        format: result.info.format,
                        width: result.info.width,
                        height: result.info.height,
                        size: result.info.bytes,
                    });
                    widget.close();
                }

                if (result.event === 'close' || result.event === 'abort') {
                    reject(new Error('Upload cancelled'));
                }
            }
        );

        widget.open();
    });
}

/**
 * Opens Cloudinary upload widget for multiple images
 */
export function uploadMultipleImages(options?: {
    folder?: string;
    maxFiles?: number;
}): Promise<UploadedImage[]> {
    return new Promise((resolve, reject) => {
        if (!window.cloudinary) {
            reject(new Error('Cloudinary widget not loaded'));
            return;
        }

        const uploadedImages: UploadedImage[] = [];

        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: CLOUD_NAME,
                uploadPreset: UPLOAD_PRESET,
                sources: ['local', 'url', 'camera'],
                multiple: true,
                maxFiles: options?.maxFiles || 10,
                maxFileSize: 10000000, // 10MB
                clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
                folder: options?.folder || 'portfolio/media',
                resourceType: 'image',
                styles: widgetStyles,
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (result.event === 'success' && result.info) {
                    uploadedImages.push({
                        url: result.info.secure_url,
                        publicId: result.info.public_id,
                        name: result.info.original_filename,
                        format: result.info.format,
                        width: result.info.width,
                        height: result.info.height,
                        size: result.info.bytes,
                    });
                }

                if (result.event === 'queues-end') {
                    resolve(uploadedImages);
                    widget.close();
                }

                if (result.event === 'close' && uploadedImages.length > 0) {
                    resolve(uploadedImages);
                }

                if (result.event === 'abort') {
                    reject(new Error('Upload cancelled'));
                }
            }
        );

        widget.open();
    });
}

/**
 * Opens Cloudinary upload widget for generic files (PDFs, Docs, etc.)
 */
export function uploadMultipleFiles(options?: {
    folder?: string;
    maxFiles?: number;
}): Promise<UploadedImage[]> {
    return new Promise((resolve, reject) => {
        if (!window.cloudinary) {
            reject(new Error('Cloudinary widget not loaded'));
            return;
        }

        const uploadedFiles: UploadedImage[] = [];

        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: CLOUD_NAME,
                uploadPreset: UPLOAD_PRESET,
                sources: ['local', 'url'],
                multiple: true,
                maxFiles: options?.maxFiles || 10,
                maxFileSize: 20000000, // 20MB
                // Allow common document formats + archives
                clientAllowedFormats: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'zip', 'rar', '7z'],
                folder: options?.folder || 'portfolio/documents',
                resourceType: 'auto', // Auto-detect type
                styles: widgetStyles,
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (result.event === 'success' && result.info) {
                    uploadedFiles.push({
                        url: result.info.secure_url,
                        publicId: result.info.public_id,
                        name: result.info.original_filename,
                        format: result.info.format,
                        width: 0, // Not applicable for docs
                        height: 0, // Not applicable for docs
                        size: result.info.bytes,
                    });
                }

                if (result.event === 'queues-end') {
                    resolve(uploadedFiles);
                    widget.close();
                }

                if (result.event === 'close' && uploadedFiles.length > 0) {
                    resolve(uploadedFiles);
                }

                if (result.event === 'abort') {
                    reject(new Error('Upload cancelled'));
                }
            }
        );

        widget.open();
    });
}

/**
 * Generate optimized Cloudinary URL with transformations
 */
export function getOptimizedUrl(
    publicId: string,
    options?: {
        width?: number;
        height?: number;
        quality?: 'auto' | number;
        format?: 'auto' | 'webp' | 'jpg' | 'png';
    }
): string {
    const width = options?.width ? `w_${options.width}` : '';
    const height = options?.height ? `h_${options.height}` : '';
    const quality = options?.quality ? `q_${options.quality}` : 'q_auto';
    const format = options?.format ? `f_${options.format}` : 'f_auto';

    const transformations = [width, height, quality, format, 'c_fill']
        .filter(Boolean)
        .join(',');

    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
