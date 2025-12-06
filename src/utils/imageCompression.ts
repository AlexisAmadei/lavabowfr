/**
 * Image compression utility using TinyPNG API via serverless function
 * Compresses and optionally converts images to WebP format
 */

/** Helper: convert File to base64 data URL */
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

/**
 * Compresses an image file and converts it to WebP format using the serverless `/api/tinypng`
 * endpoint. The server is expected to hold the TinyPNG key in its environment.
 */
export const compressAndConvertToWebP = async (file: File): Promise<File> => {
    if (file.size > 5 * 1024 * 1024) { // 5MB maximum for TinyPNG
        console.warn('File size above 5MB. Skipping compression.');
        return file;
    }
    if (file.type === 'image/webp') {
        console.warn('File is already in WebP format. Skipping compression.');
        return file;
    }

    console.log(`Starting compression for: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`);

    try {
        const base64Data = await fileToBase64(file);

        const response = await fetch('/api/tinypng', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageData: base64Data, convertToWebP: true }),
        });
        if (response.status === 404) {
            console.error('Compression endpoint not found (404).');
            return file;
        }

        if (!response.ok) {
            const error = await response.json();
            console.error('Compression failed:', error.error || 'Unknown error');
            return file;
        }

        const result = await response.json();
        const { imageData, isWebP, originalSize, compressedSize } = result;

        const binaryString = atob(imageData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        const blob = new Blob([bytes], { type: isWebP ? 'image/webp' : file.type });

        const originalName = file.name.replace(/\.[^/.]+$/, '');
        const fileName = isWebP ? `${originalName}.webp` : file.name;
        const compressedFile = new File([blob], fileName, { type: blob.type });

        if (originalSize && compressedSize) {
            const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
            console.log(`✓ Compression complete: ${(originalSize / 1024).toFixed(2)}KB → ${(compressedSize / 1024).toFixed(2)}KB (${reduction}% reduction)`);
        }

        return compressedFile;
    } catch (error) {
        console.error('Error compressing image:', error);
        return file;
    }
};

/**
 * Compress without converting to WebP. Uses the same `/api/tinypng` endpoint and requests
 * the server perform compression only.
 */
export const compressImage = async (file: File): Promise<File> => {
    if (file.size > 5 * 1024 * 1024) {
        console.warn('File size above 5MB. Skipping compression.');
        return file;
    }

    try {
        const base64Data = await fileToBase64(file);

        const response = await fetch('/api/tinypng', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageData: base64Data, convertToWebP: false }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Compression failed:', error.error || 'Unknown error');
            return file;
        }

        const result = await response.json();
        const { imageData, isWebP, originalSize, compressedSize } = result;

        const binaryString = atob(imageData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        const blob = new Blob([bytes], { type: isWebP ? 'image/webp' : file.type });

        const originalName = file.name.replace(/\.[^/.]+$/, '');
        const fileName = isWebP ? `${originalName}.webp` : file.name;
        const compressedFile = new File([blob], fileName, { type: blob.type });

        if (originalSize && compressedSize) {
            const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
            console.log(`✓ Compression complete: ${(originalSize / 1024).toFixed(2)}KB → ${(compressedSize / 1024).toFixed(2)}KB (${reduction}% reduction)`);
        }

        return compressedFile;
    } catch (error) {
        console.error('Error compressing image:', error);
        return file;
    }
};
