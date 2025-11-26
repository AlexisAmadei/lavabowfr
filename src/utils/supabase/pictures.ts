import { PictureItem } from "@/types/types";
import { supabase } from "./supabase";
import { compressAndConvertToWebP } from "@/utils/imageCompression";

/**
 * Uploads a picture file to the Supabase storage bucket 'lavabowfr/pictures/'
 * Compresses and converts the image to WebP before uploading
 * @param file - The file to upload
 * @param fileName - The name to save the file as
 * @returns The public URL of the uploaded file, or null if upload fails
 */
export const uploadPictureFile = async (file: File, fileName: string): Promise<string> => {
    // Compress and convert to WebP
    const compressedFile = await compressAndConvertToWebP(file)
    
    // Update filename to have .webp extension if it was converted
    const finalFileName = compressedFile.type === 'image/webp' 
        ? fileName.replace(/\.[^/.]+$/, '.webp')
        : fileName
    
    const sanitizedFileName = finalFileName
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/_{2,}/g, '_')

    const { error } = await supabase.storage
        .from('lavabowfr')
        .upload(`pictures/${sanitizedFileName}`, compressedFile)

    if (error) throw new Error(error.message)

    const { data } = supabase.storage
        .from('lavabowfr')
        .getPublicUrl(`pictures/${sanitizedFileName}`)

    return data.publicUrl
}

/**
 * Fetches all pictures content from the database.
 * @param setPicturesContent - React state setter function to update pictures content.
 */
export const fetchPicturesContent = async (
    setPicturesContent: (content: PictureItem[]) => void
): Promise<void> => {
    try {
        const { data: section_pictures, error } = await supabase
            .from('section_pictures')
            .select('*')
            .neq('status', 'deleted')
            .order('id', { ascending: true });

        if (error) {
            console.error('Error fetching pictures content:', error);
            return;
        }

        setPicturesContent(section_pictures || []);
    } catch (error) {
        console.error('Exception fetching pictures content:', error);
    }
}

/**
 * Inserts a new picture item into the database.
 * @param item - The picture item to insert.
 * @returns Array containing the inserted item data, or null if error.
 */
export const insertPictureItem = async (item: PictureItem): Promise<PictureItem[] | null> => {
    let uploadedUrl: string | null = null

    if (!item.title) {
        console.error('Title is required to insert a picture item.')
        return null
    }

    // Upload image file if provided
    if (item.img && item.img instanceof File) {
        console.log('Uploading picture file for a new item...')
        const timestamp = Date.now()
        const fileName = `${timestamp}_${item.img.name}`
        uploadedUrl = await uploadPictureFile(item.img, fileName)
    }

    try {
        const { data, error } = await supabase
            .from('section_pictures')
            .insert([{
                title: item.title,
                description: item.description || null,
                date: item.date || null,
                link: uploadedUrl,
                place: item.place || null,
                status: 'active',
            }])
            .select()

        if (error) {
            console.error('Error inserting picture item:', error)
            return null
        }

        return data
    } catch (error) {
        console.error('Exception inserting picture item:', error)
        return null
    }
}

/**
 * Updates an existing picture item in the database.
 * @param id - The ID of the picture item to update.
 * @param updatedItem - The updated picture item data.
 * @returns Array containing the updated item data, or null if error.
 */
export const updatePictureItem = async (
    id: number,
    updatedItem: PictureItem
): Promise<PictureItem[] | null> => {
    const { title, description, date, link, place, status } = updatedItem

    try {
        const { error: updateError } = await supabase
            .from('section_pictures')
            .update({ title, description, date, link, place, status })
            .eq('id', id)

        if (updateError) {
            console.error('Error updating picture item:', updateError)
            return null
        }

        // Fetch the updated row
        const { data, error: selectError } = await supabase
            .from('section_pictures')
            .select('*')
            .eq('id', id)
            .single()

        if (selectError) {
            console.error('Error fetching updated picture:', selectError)
            return [updatedItem]
        }

        return [data]
    } catch (error) {
        console.error('Exception updating picture item:', error)
        return null
    }
}

/**
 * Replaces the image file for an existing picture item.
 * @param id - The ID of the picture item to update.
 * @param file - The new image file to upload.
 * @returns The public URL of the new image, or null if error.
 */
export const replacePictureFile = async (id: number, file: File): Promise<string | null> => {
    try {
        // Upload the new file
        const timestamp = Date.now()
        const fileName = `${timestamp}_${file.name}`
        const uploadedUrl = await uploadPictureFile(file, fileName)

        if (!uploadedUrl) {
            console.error('Failed to upload new picture file')
            return null
        }

        // Update the database record with the new link
        const { error } = await supabase
            .from('section_pictures')
            .update({ link: uploadedUrl })
            .eq('id', id)

        if (error) {
            console.error('Error updating picture link:', error)
            return null
        }

        return uploadedUrl
    } catch (error) {
        console.error('Exception replacing picture file:', error)
        return null
    }
}

/**
 * Deletes a picture item by ID (soft delete by setting status to DELETED).
 * @param id - The ID of the picture item to delete.
 * @returns True if deletion was successful, null if there was an error.
 */
export const deletePictureItem = async (id: number): Promise<boolean | null> => {
    const { error } = await supabase
        .from('section_pictures')
        .update({ status: 'deleted' })
        .eq('id', id)

    if (error) {
        console.error('Error deleting picture item:', error)
        return null
    }

    return true
}
