"use client";
import React, { useState, useRef, useCallback } from 'react';
import { FiUploadCloud, FiX, FiAlertCircle, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';
import { AdminService } from '@/services/admin.service';
import toast from 'react-hot-toast';

const MAX_GALLERY_IMAGES = 100;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
// Resize target: max dimension 2048px — preserves quality for web display
const MAX_DIMENSION = 2048;
const JPEG_QUALITY = 0.88;
// Upload images in batches of 5 to avoid overwhelming the server
const BATCH_SIZE = 5;

interface GalleryImage {
    url: string;
    fileType: string;
}

interface UploadProgress {
    total: number;
    completed: number;
    failed: number;
    percentage: number;
    isUploading: boolean;
    failedFiles: { name: string; reason: string }[];
}

interface GalleryUploaderProps {
    images: GalleryImage[];
    setImages: React.Dispatch<React.SetStateAction<GalleryImage[]>>;
}

/**
 * Resizes an image on a canvas while maintaining aspect ratio.
 * Uses the canvas 2D API — zero external dependencies, runs in the browser.
 * Returns a Blob (JPEG) at the configured quality.
 */
const resizeImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
        // Skip non-image files
        if (!file.type.startsWith('image/')) {
            return reject(new Error('Not an image file'));
        }

        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            let { width, height } = img;

            // Only resize if the image exceeds the max dimension
            if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) {
                // No resize needed — but still re-encode to JPEG for consistency
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return resolve(file);
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(
                    (blob) => {
                        if (!blob) return resolve(file);
                        const resized = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        // Only use the resized version if it's actually smaller
                        resolve(resized.size < file.size ? resized : file);
                    },
                    'image/jpeg',
                    JPEG_QUALITY
                );
                return;
            }

            // Calculate new dimensions maintaining aspect ratio
            const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
            const newWidth = Math.round(width * ratio);
            const newHeight = Math.round(height * ratio);

            const canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) return resolve(file);

            // Use high-quality image smoothing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            canvas.toBlob(
                (blob) => {
                    if (!blob) return resolve(file);
                    const resized = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });
                    resolve(resized);
                },
                'image/jpeg',
                JPEG_QUALITY
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
};

/**
 * Uploads a single file to the server via AdminService.
 * Returns the uploaded image data or throws on failure.
 */
const uploadSingleImage = async (file: File): Promise<GalleryImage> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await AdminService.uploadSingleFile(formData);
    if (data?.success && data?.data) {
        return { url: data.data.url, fileType: data.data.fileType };
    }
    throw new Error(data?.message || 'Upload failed');
};

export const GalleryUploader = ({ images, setImages }: GalleryUploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [progress, setProgress] = useState<UploadProgress>({
        total: 0,
        completed: 0,
        failed: 0,
        percentage: 0,
        isUploading: false,
        failedFiles: [],
    });
    const [showFailedDetails, setShowFailedDetails] = useState(false);

    const handleGalleryUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        const filesArray = Array.from(selectedFiles);

        // Check total limit
        if (images.length + filesArray.length > MAX_GALLERY_IMAGES) {
            toast.error(`Maximum ${MAX_GALLERY_IMAGES} gallery images allowed. You can add ${MAX_GALLERY_IMAGES - images.length} more.`);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // Validate individual files and collect errors
        const validFiles: File[] = [];
        const skippedFiles: { name: string; reason: string }[] = [];

        for (const file of filesArray) {
            if (!file.type.startsWith('image/')) {
                skippedFiles.push({ name: file.name, reason: 'Not an image file' });
                continue;
            }
            if (file.size > MAX_FILE_SIZE_BYTES) {
                skippedFiles.push({ name: file.name, reason: `Exceeds ${MAX_FILE_SIZE_MB}MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB)` });
                continue;
            }
            validFiles.push(file);
        }

        if (skippedFiles.length > 0) {
            toast.error(`${skippedFiles.length} file(s) skipped due to validation errors.`);
        }

        if (validFiles.length === 0) {
            if (fileInputRef.current) fileInputRef.current.value = '';
            setProgress(prev => ({ ...prev, failedFiles: [...prev.failedFiles, ...skippedFiles] }));
            return;
        }

        // Initialize progress
        setProgress({
            total: validFiles.length,
            completed: 0,
            failed: 0,
            percentage: 0,
            isUploading: true,
            failedFiles: [...skippedFiles],
        });

        const successImages: GalleryImage[] = [];
        const failedUploads: { name: string; reason: string }[] = [...skippedFiles];
        let completedCount = 0;

        // Process in batches to avoid overwhelming server
        for (let i = 0; i < validFiles.length; i += BATCH_SIZE) {
            const batch = validFiles.slice(i, i + BATCH_SIZE);
            
            const batchPromises = batch.map(async (file) => {
                try {
                    // Step 1: Resize (client-side, preserves quality)
                    let processedFile: File;
                    try {
                        processedFile = await resizeImage(file);
                    } catch {
                        processedFile = file; // If resize fails, use original
                    }

                    // Step 2: Upload
                    const result = await uploadSingleImage(processedFile);
                    successImages.push(result);
                } catch (err: any) {
                    failedUploads.push({
                        name: file.name,
                        reason: err?.message || 'Upload failed',
                    });
                } finally {
                    completedCount++;
                    setProgress(prev => ({
                        ...prev,
                        completed: completedCount,
                        failed: failedUploads.length - skippedFiles.length, // Don't count pre-upload skips
                        percentage: Math.round((completedCount / validFiles.length) * 100),
                        failedFiles: [...failedUploads],
                    }));
                }
            });

            await Promise.all(batchPromises);
        }

        // Commit all successful images at once
        if (successImages.length > 0) {
            setImages(prev => [...prev, ...successImages]);
            toast.success(`${successImages.length} image(s) uploaded successfully!`);
        }

        if (failedUploads.length > skippedFiles.length) {
            const uploadFailCount = failedUploads.length - skippedFiles.length;
            toast.error(`${uploadFailCount} image(s) failed to upload.`);
        }

        // Mark upload as complete but keep progress visible
        setProgress(prev => ({ ...prev, isUploading: false }));

        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [images.length, setImages]);

    const clearProgress = () => {
        setProgress({
            total: 0,
            completed: 0,
            failed: 0,
            percentage: 0,
            isUploading: false,
            failedFiles: [],
        });
        setShowFailedDetails(false);
    };

    const retryFailed = () => {
        // Clear progress and open file picker for manual re-selection
        clearProgress();
        fileInputRef.current?.click();
    };

    const progressSuccessCount = progress.completed - (progress.failedFiles.length - progress.failedFiles.filter(f => f.reason.includes('limit') || f.reason.includes('Not an image')).length);

    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Event Gallery Images
                <span className="text-xs text-gray-400 font-normal ml-2">
                    ({images.length}/{MAX_GALLERY_IMAGES})
                </span>
            </label>

            {/* Upload Drop Zone */}
            <label className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all ${
                progress.isUploading 
                    ? 'border-primary/30 bg-primary/5 cursor-not-allowed opacity-70' 
                    : 'border-gray-200 hover:bg-gray-50 hover:border-primary/40 cursor-pointer group'
            }`}>
                <FiUploadCloud className={`w-8 h-8 mb-2 transition-colors ${
                    progress.isUploading ? 'text-primary animate-pulse' : 'text-gray-400 group-hover:text-primary'
                }`} />
                <div className="text-sm font-semibold text-primary">
                    {progress.isUploading ? 'Uploading...' : 'Upload Gallery Images'}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                    Up to {MAX_GALLERY_IMAGES} images · Max {MAX_FILE_SIZE_MB}MB each · Auto-resized for quality
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    accept="image/*"
                    disabled={progress.isUploading}
                    onChange={handleGalleryUpload}
                />
            </label>

            {/* Progress Bar */}
            {(progress.isUploading || progress.total > 0) && (
                <div className="mt-3 bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3 animate-in fade-in duration-200">
                    {/* Progress Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {progress.isUploading ? (
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            ) : progress.failed > 0 ? (
                                <FiAlertCircle className="w-4 h-4 text-amber-500" />
                            ) : (
                                <FiCheckCircle className="w-4 h-4 text-emerald-500" />
                            )}
                            <span className="text-sm font-semibold text-gray-700">
                                {progress.isUploading
                                    ? `Uploading ${progress.completed} of ${progress.total}...`
                                    : progress.failed > 0
                                        ? `Completed with ${progress.failed} error(s)`
                                        : 'All images uploaded successfully!'
                                }
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-primary">
                                {progress.percentage}%
                            </span>
                            {!progress.isUploading && (
                                <button
                                    onClick={clearProgress}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                    title="Dismiss"
                                >
                                    <FiX size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-300 ease-out ${
                                progress.failed > 0 && !progress.isUploading
                                    ? 'bg-gradient-to-r from-primary to-amber-400'
                                    : 'bg-gradient-to-r from-primary to-emerald-400'
                            }`}
                            style={{ width: `${progress.percentage}%` }}
                        />
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 text-xs font-medium">
                        <span className="text-emerald-600">
                            ✓ {progress.completed - progress.failed} uploaded
                        </span>
                        {progress.failed > 0 && (
                            <span className="text-red-500">
                                ✗ {progress.failed} failed
                            </span>
                        )}
                        {progress.isUploading && (
                            <span className="text-gray-400">
                                ◌ {progress.total - progress.completed} remaining
                            </span>
                        )}
                    </div>

                    {/* Failed Files Details */}
                    {progress.failedFiles.length > 0 && !progress.isUploading && (
                        <div>
                            <button
                                onClick={() => setShowFailedDetails(!showFailedDetails)}
                                className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                            >
                                {showFailedDetails ? 'Hide' : 'Show'} failed details ({progress.failedFiles.length})
                            </button>

                            {showFailedDetails && (
                                <div className="mt-2 max-h-32 overflow-y-auto space-y-1 custom-scrollbar">
                                    {progress.failedFiles.map((f, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs bg-red-50 rounded-lg px-3 py-1.5 border border-red-100">
                                            <FiAlertCircle className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />
                                            <div>
                                                <span className="font-semibold text-gray-700 break-all">{f.name}</span>
                                                <span className="text-red-500 ml-1">— {f.reason}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Retry Button */}
                            <button
                                onClick={retryFailed}
                                className="mt-2 flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                            >
                                <FiRefreshCw className="w-3 h-3" />
                                Re-select and upload
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Uploaded Images Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mt-4">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg bg-gray-100 border overflow-hidden group">
                            <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                                type="button"
                                className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <FiX size={12} />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm text-white text-[8px] font-bold text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                {idx + 1}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
