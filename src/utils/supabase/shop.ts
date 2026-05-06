import { supabase } from "./supabase";

export interface MerchItem {
  id?: number;
  name: string;
  description: string;
  price: number | string;
  // NOT NULL in DB; optional in TS during the v1→v2 transition until the admin UI inputs cents directly.
  price_cents?: number;
  // null = unlimited stock; decremented on checkout.session.completed.
  stock?: number | null;
  tags: string[];
  stripe_paylink: string;
  out_of_stock: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  image_url?: string;
  category?: number;
}

export interface MerchCategory {
  id: number;
  name: string;
  order?: number;
}

export async function fetchMerchItems(activeOnly?: boolean): Promise<MerchItem[]> {
  try {
    let query = supabase
      .from('merch_items')
      .select('*')
      .neq('status', 'DELETED')

    if (activeOnly) {
      query = query.eq('status', 'ACTIVE');
    }

    const { data: merch_items, error } = await query;

    if (error) {
      console.error('Error fetching merch items:', error);
      return [];
    }
    return (merch_items || []).map(item => ({
      ...item,
      tags: Array.isArray(item.tags) ? item.tags : []
    })) as MerchItem[];
  } catch (error) {
    console.error('Unexpected error fetching merch items:', error);
    return [];
  }
}

export async function updateMerchItem(item: MerchItem): Promise<boolean> {
  try {
    // Bridge: admin form still edits whole-euro `price`; derive `price_cents` so the v2 column stays valid.
    const priceCents = typeof item.price_cents === 'number'
      ? item.price_cents
      : Math.round(Number(item.price) * 100);
    const update: Record<string, unknown> = {
      name: item.name,
      description: item.description,
      price: item.price,
      price_cents: priceCents,
      tags: item.tags,
      stripe_paylink: item.stripe_paylink,
      out_of_stock: item.out_of_stock,
      status: item.status,
      image_url: item.image_url,
      category: item.category,
    };
    // Only touch `stock` when explicitly provided so admin saves don't accidentally null it out.
    if (item.stock !== undefined) update.stock = item.stock;
    const { error } = await supabase
      .from('merch_items')
      .update(update)
      .eq('id', item.id);
    if (error) {
      console.error('Error updating merch item:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Unexpected error updating merch item:', error);
    return false;
  }
}

export async function addMerchItem(item: Omit<MerchItem, 'id'>): Promise<boolean> {
  try {
    // Bridge: admin form still edits whole-euro `price`; derive `price_cents` so the v2 column stays valid.
    const priceCents = typeof item.price_cents === 'number'
      ? item.price_cents
      : Math.round(Number(item.price) * 100);
    const { error } = await supabase
      .from('merch_items')
      .insert([{
        name: item.name,
        description: item.description,
        price: item.price,
        price_cents: priceCents,
        stock: item.stock ?? null,
        tags: item.tags,
        stripe_paylink: item.stripe_paylink,
        out_of_stock: item.out_of_stock,
        status: item.status,
        image_url: item.image_url,
        category: item.category
      }]);
    if (error) {
      console.error('Error adding merch item:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Unexpected error adding merch item:', error);
    return false;
  }
}

/**
 * Upload an image to Supabase storage in the merch folder
 * @param file - The image file to upload
 * @param itemName - The name of the merch item (used for organizing files)
 * @returns The public URL of the uploaded image or null if upload failed
 */
export async function uploadMerchImage(file: File, itemName: string): Promise<string | null> {
  try {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${itemName.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.${fileExt}`;
    const filePath = `merch/${fileName}`;

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('lavabowfr')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    // Get public URL
    const { data } = supabase.storage
      .from('lavabowfr')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Unexpected error uploading image:', error);
    return null;
  }
}

/**
 * Delete an image from Supabase storage
 * @param imageUrl - The public URL of the image to delete
 * @returns True if deletion was successful
 */
export async function deleteMerchImage(imageUrl: string): Promise<boolean> {
  try {
    // Extract the file path from the URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf('merch')).join('/');

    const { error } = await supabase.storage
      .from('lavabowfr')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error deleting image:', error);
    return false;
  }
}

// ===== CATEGORY FUNCTIONS =====

export async function fetchMerchCategories(): Promise<MerchCategory[]> {
  try {
    const { data: categories, error } = await supabase
      .from('merch_categories')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return (categories || []) as MerchCategory[];
  } catch (error) {
    console.error('Unexpected error fetching categories:', error);
    return [];
  }
}

export async function addMerchCategory(name: string): Promise<boolean> {
  try {
    // Get the current highest order number
    const { data: categories, error: fetchError } = await supabase
      .from('merch_categories')
      .select('order')
      .order('order', { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error('Error fetching categories for order:', fetchError);
      return false;
    }

    // Calculate the next order number
    const nextOrder = (categories && categories.length > 0 && categories[0].order !== null)
      ? (categories[0].order as number) + 1
      : 0;

    // Insert new category with the next order
    const { error } = await supabase
      .from('merch_categories')
      .insert([{ name, order: nextOrder }]);

    if (error) {
      console.error('Error adding category:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error adding category:', error);
    return false;
  }
}

export async function updateMerchCategory(id: number, name: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('merch_categories')
      .update({ name })
      .eq('id', id);

    if (error) {
      console.error('Error updating category:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error updating category:', error);
    return false;
  }
}

export async function deleteMerchCategory(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('merch_categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error deleting category:', error);
    return false;
  }
}

export async function updateCategoryOrder(categories: MerchCategory[]): Promise<boolean> {
  try {
    console.log('updateCategoryOrder called with categories:', categories);
    
    const updates = categories.map((category, index) => ({
      id: category.id,
      order: index
    }));

    console.log('Updates to be applied:', updates);

    for (const update of updates) {
      console.log(`Updating category id ${update.id} with order ${update.order}`);
      
      const { error, data, status } = await supabase
        .from('merch_categories')
        .update({ order: update.order })
        .eq('id', update.id)
        .select();

      console.log(`Update response for id ${update.id}:`, { error, data, status });

      if (error) {
        console.error(`Error updating category id ${update.id}:`, error);
        return false;
      }
      
      if (!data || data.length === 0) {
        console.warn(`No rows updated for category id ${update.id}. This might indicate an RLS policy issue.`);
      }
      
      console.log(`Successfully updated category id ${update.id}`);
    }

    console.log('All category orders updated successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error updating category order:', error);
    return false;
  }
}