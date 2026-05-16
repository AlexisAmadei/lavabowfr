import { GlobalVariable } from "@/types/types";
import { supabase } from "./supabase";

export const getGlobalVariables = async (): Promise<GlobalVariable[]> => {
  const { data, error } = await supabase
    .from("global_variables")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching global variables:", error);
    return [];
  }

  return data ?? [];
};

export const insertGlobalVariable = async (name: string, value: string): Promise<GlobalVariable | null> => {
  const { data, error } = await supabase
    .from("global_variables")
    .insert({ name, value })
    .select("*")
    .single();

  if (error) {
    console.error("Error creating global variable:", error);
    return null;
  }

  return data;
};

export const updateGlobalVariableValue = async (id: number, value: string): Promise<boolean> => {
  const { error } = await supabase
    .from("global_variables")
    .update({ value })
    .eq("id", id);

  if (error) {
    console.error("Error updating global variable:", error);
    return false;
  }

  return true;
};

export const deleteGlobalVariable = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from("global_variables")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting global variable:", error);
    return false;
  }

  return true;
};
