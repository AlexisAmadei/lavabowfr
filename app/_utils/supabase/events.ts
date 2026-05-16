import { EventItem } from "@/types/types";
import { supabase } from "./supabase";
import { toaster } from "@/components/ui/toaster";

/**
 * Uploads a file to the Supabase storage bucket 'lavabowfr'
 * @param file - The file to upload
 * @param fileName - The name to save the file as
 * @returns The public URL of the uploaded file, or null if upload fails
 */
export const uploadFile = async (file: File, fileName: string): Promise<string | null> => {
    try {
        // Sanitize filename: remove special characters and spaces
        const sanitizedFileName = fileName
            .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars with underscore
            .replace(/_{2,}/g, '_'); // Replace multiple underscores with single one

        // Upload file to the lavabowfr bucket
        const { error } = await supabase.storage
            .from('lavabowfr')
            .upload(`events/${sanitizedFileName}`, file, {
                cacheControl: '3600',
                upsert: true // Overwrites file if it already exists
            });

        if (error) {
            console.error('Error uploading file to Supabase storage:', error);
            return null;
        }

        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
            .from('lavabowfr')
            .getPublicUrl(`events/${sanitizedFileName}`);

        return publicUrl;
    } catch (error) {
        console.error('Exception uploading file:', error);
        return null;
    }
};

export const fetchEventsContent = async (
    setEventsContent: (events: EventItem[]) => void
): Promise<void> => {
    try {
        const { data: section_events, error } = await supabase
            .from('section_events')
            .select('*')
            .neq('status', 'DELETED')
            .order('date', { ascending: true });

        if (error) {
            console.error('Error fetching events content:', error);
            return;
        }

        setEventsContent(section_events || []);
    } catch (error) {
        console.error('Error fetching events content:', error);
    }
}

export const insertEventItem = async (eventData: EventItem) => {
    // Validate required fields - note: price can be 0 for free events
    if (!eventData.title || typeof eventData.price !== 'number' || !eventData.date || !eventData.place) {
        console.error('All fields are required to insert an event item.', eventData);
        toaster.create({
          title: 'Title, price, date, and place are required fields.',
          description: 'Please fill in all required fields before submitting.',
          type:'error',
        })
        return null;
    }

    let imgUrl = '';

    // Handle file upload if img is a File object
    if (eventData.img && eventData.img instanceof File) {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${eventData.img.name}`;
        const uploadResult = await uploadFile(eventData.img, fileName);
        if (uploadResult) {
            imgUrl = uploadResult; // Store the full public URL
        } else {
            console.error('Failed to upload image file.');
        }
    } else if (typeof eventData.img === 'string') {
        imgUrl = eventData.img;
    }

    const { data, error } = await supabase
        .from('section_events')
        .insert([
            {
                title: eventData.title,
                description: eventData.description,
                price: eventData.price,
                date: eventData.date,
                place: eventData.place,
                link: eventData.link,
                img: imgUrl || null,
            }])
        .select()
    if (error) {
        console.error('Error inserting event item:', error);
        return null;
    }

    return data;
}

/**
 * Updates an existing event item in the database.
 * @param id - The ID of the event item to update.
 * @param updatedEvent - The updated event item data.
 * @returns Array containing the updated item data, or null if error.
 */
export const updateEventItem = async (
    id: number,
    updatedEvent: EventItem
): Promise<EventItem[] | null> => {
    const { title, description, price, date, place, link, img, status } = updatedEvent;
    let imgUrl = '';

    if (img) {
        if (img instanceof File) {
            const fileName = `${id}_${img.name}`;
            const uploadResult = await uploadFile(img, fileName);
            
            if (uploadResult) {
                imgUrl = uploadResult; // Store the full public URL
            } else {
                console.error('Failed to upload image file.');
            }
        } else if (typeof img === 'string') {
            imgUrl = img;
        }
    }

    try {
        const { data, error: updateError } = await supabase
            .from('section_events')
            .update({ title, description, price, date, place, link, img: imgUrl, status })
            .eq('id', id)
            .select();

        if (updateError) {
            console.error('Error updating event item:', updateError);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Exception updating event item:', error);
        return null;
    }
}
