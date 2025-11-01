import { EventItem } from "@/types/types";
import { supabase } from "./supabase";

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
    if (!eventData.title || !eventData.description || !eventData.price || !eventData.date || !eventData.place) {
        console.error('All fields are required to insert an event item.');
        return null;
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
                img: eventData.img || null,
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

    try {
        const { data, error: updateError } = await supabase
            .from('section_events')
            .update({ title, description, price, date, place, link, img, status })
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
