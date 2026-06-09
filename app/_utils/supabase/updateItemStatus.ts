import { supabase } from "./supabase";

export async function updateItemStatus(tableName: string, itemId: number, status: string) {
  if (!status) return null;

  const newStatus = status.toLowerCase() === 'active' ? 'inactive' : 'active';

  const { data, error } = await supabase
    .from(tableName)
    .update({ status: newStatus })
    .eq('id', itemId)
    .select()

  if (error) {
    console.error(`Erreur lors de la mise à jour du statut de l'élément dans la table ${tableName} :`, error);
    return null;
  }

  if (data) {
    console.info(`Statut mis à jour avec succès pour l'élément ID ${itemId} dans la table ${tableName} :`, data);
  }

  return data;
}