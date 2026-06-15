import { PictureItem } from "@/types/types";
import { supabase } from "./supabase";

/**
 * Uploads a picture file to the Supabase storage bucket 'lavabowfr/pictures/'
 * Compresses and converts the image to WebP before uploading
 * @param file - The file to upload
 * @param fileName - The name to save the file as
 * @returns The storage path in the bucket
 */
export const uploadPictureFile = async (file: File, fileName: string): Promise<string> => {
  const sanitizedFileName = fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')

  const storagePath = `pictures/${sanitizedFileName}`

  // console.log(`Uploading file "${file.name}" as "${sanitizedFileName}" to Supabase storage...`)
  const { error } = await supabase.storage
    .from('lavabowfr')
    // Use upsert so replacing a file with the same name overwrites it.
    .upload(storagePath, file, { cacheControl: '3600', upsert: true })

  if (error) throw new Error(error.message)

  return storagePath;
}

/**
 * Fetches all pictures content from the database and generates public URLs.
 * Note: Requires appropriate RLS policies to allow read access to the storage bucket.
 * @param setPicturesContent - React state setter function to update pictures content.
 */
export const fetchPicturesContent = async (
  setPicturesContent: (content: PictureItem[]) => void
): Promise<void> => {
  try {
    const { data: section_pictures, error } = await supabase
      .from('section_pictures')
      .select('*')
      .neq('status', 'DELETED')
      .order('date', { ascending: false, nullsFirst: false })
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching pictures content:', error);
      return;
    }

    // Generate public URLs for each picture with storage_ref
    const picturesWithPublicUrls = (section_pictures || []).map((picture) => {
      if (picture.storage_ref) {
        const { data: { publicUrl } } = supabase.storage
          .from('lavabowfr')
          .getPublicUrl(picture.storage_ref);

        return { ...picture, link: publicUrl };
      }
      return picture;
    });

    setPicturesContent(picturesWithPublicUrls);
  } catch (error) {
    console.error('Exception fetching pictures content:', error);
  }
}

/**
 * Inserts a new picture item into the database.
 * @param item - The picture item to insert.
 * @returns Array containing the inserted item data, or null if error.
 */
export const insertPictureItem = async (item: PictureItem & { img?: File }): Promise<PictureItem[] | null> => {
  let storagePath: string | null = null

  if (!item.title) {
    console.error('Title is required to insert a picture item.')
    return null
  }

  // Upload image file if provided
  if (item.img && item.img instanceof File) {
    // console.log('Uploading picture file for a new item...')
    const timestamp = Date.now()
    const fileName = `${timestamp}_${item.img.name}`
    storagePath = await uploadPictureFile(item.img, fileName)
  }

  const { data, error } = await supabase
    .from('section_pictures')
    .insert([{
      title: item.title,
      storage_ref: storagePath,
      date: item.date || null,
      place: item.place || null,
      status: 'ACTIVE',
    }])
    .select()

  if (error) {
    console.error('Error inserting picture item:', error)
    return null
  }

  return data
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
  const { title, date, place, status } = updatedItem

  // console.log(`Updating picture item with data ${JSON.stringify({ title, date, place, status })}...`)

  // Note: storage_ref is not updated here - use replacePictureFile to update the image
  const { data, error } = await supabase
    .from('section_pictures')
    .update({ title, date, place, status })
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error updating picture item:', error)
    return null
  }

  return data
}

/**
 * Replaces the image file for an existing picture item.
 * @param id - The ID of the picture item to update.
 * @param file - The new image file to upload.
 * @returns The public URL of the new image, or null if error.
 */
export const replacePictureFile = async (id: number, file: File): Promise<string | null> => {
  try {
    // Fetch the current DB record so we can delete the previous storage object later
    const { data: currentRecord, error: selectError } = await supabase
      .from('section_pictures')
      .select('storage_ref')
      .eq('id', id)
      .single()

    if (selectError) {
      // Not fatal, but log it — we won't be able to remove the old file if we can't read it
      console.warn('Could not fetch current picture storage_ref before replace:', selectError)
    }

    const previousStorageRef: string | null = currentRecord?.storage_ref || null

    // Upload the new file
    const timestamp = Date.now()
    const fileName = `${timestamp}_${file.name}`
    const storagePath = await uploadPictureFile(file, fileName)

    if (!storagePath) {
      console.error('Failed to upload new picture file')
      return null
    }

    // Update the database record with the new storage_ref
    const { error } = await supabase
      .from('section_pictures')
      .update({
        storage_ref: storagePath,
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating picture storage_ref:', error)
      return null
    }

    // If there was a previous stored file, remove it from storage
    if (previousStorageRef) {
      try {
        const { error: removeError } = await supabase.storage
          .from('lavabowfr')
          .remove([previousStorageRef])

        if (removeError) {
          // Non-fatal: log the error but keep the new URL in DB
          console.warn('Failed to remove previous picture from storage:', removeError)
        }
      } catch (remErr) {
        console.warn('Exception when removing previous picture from storage:', remErr)
      }
    }

    return storagePath
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
    .update({ status: 'DELETED' })
    .eq('id', id)

  if (error) {
    console.error('Error deleting picture item:', error)
    return null
  }

  return true
}
