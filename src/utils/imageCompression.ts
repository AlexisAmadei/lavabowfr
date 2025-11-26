/**
 * Image compression utility using TinyPNG API via serverless function
 * Compresses and converts images to WebP format
 */

/**
 * Compresses an image file and converts it to WebP format using TinyPNG API
 * @param file - The image file to compress
 * @returns A new File object with the compressed WebP image
 * @throws Error if compression fails
 */
export const compressAndConvertToWebP = async (file: File): Promise<File> => {
    console.log(`Starting compression for: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`);

    try {
        // Convert file to base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        const base64Data = await base64Promise;

        // Call serverless function
        const response = await fetch('/api/tinypng', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageData: base64Data }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Compression failed');
        }

        const result = await response.json();
        const { imageData, isWebP, originalSize, compressedSize } = result;

        // Convert base64 back to File
        const binaryString = atob(imageData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: isWebP ? 'image/webp' : file.type });

        const originalName = file.name.replace(/\.[^/.]+$/, '');
        const fileName = isWebP ? `${originalName}.webp` : file.name;
        const compressedFile = new File([blob], fileName, { type: blob.type });

        const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
        console.log(`✓ Compression complete: ${(originalSize / 1024).toFixed(2)}KB → ${(compressedSize / 1024).toFixed(2)}KB (${reduction}% reduction)`);

        return compressedFile;
    } catch (error) {
        console.error('Error compressing image:', error);
        throw error; // Propagate error instead of returning original file
    }
};

/**
 * Alternative method: Compress without converting to WebP
 * @param file - The image file to compress
 * @returns A new File object with the compressed image
 */
export const compressImage = async (file: File): Promise<File> => {
    if (!TINIFY_API_KEY) {
        console.warn('TinyPNG API key not found. Skipping compression.');
        return file;
    }

    try {
        const arrayBuffer = await file.arrayBuffer();

        const response = await fetch('https://api.tinify.com/shrink', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${btoa(`api:${TINIFY_API_KEY}`)}`,
            },
            body: arrayBuffer,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`TinyPNG compression failed: ${error.message || response.statusText}`);
        }

        const data = await response.json();
        const compressedUrl = data.output.url;

        // Download the compressed image
        const downloadResponse = await fetch(compressedUrl);
        const compressedBlob = await downloadResponse.blob();

        const compressedFile = new File([compressedBlob], file.name, {
            type: file.type,
        });

        console.log(`Compressed: ${(file.size / 1024).toFixed(2)}KB → ${(compressedFile.size / 1024).toFixed(2)}KB`);

        return compressedFile;
    } catch (error) {
        console.error('Error compressing image:', error);
        return file;
    }
};
