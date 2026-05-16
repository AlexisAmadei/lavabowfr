import { supabase } from "./supabase";


/* TYPE DEFINITIONS */
interface SignInResponse {
  data: any | null;
  error: any | null;
}

/**
 * Signs in a user with email and password.
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns Object containing authentication data or error.
 */
export const signInUser = async (email: string, password: string): Promise<SignInResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}