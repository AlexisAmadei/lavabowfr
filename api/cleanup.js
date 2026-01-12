import { supabase } from "../../supabaseClient";

export default async function handler(req, res) {
    const { error } = await supabase
        .from("online_users")
        .delete()
        .lt("last_seen", new Date(Date.now() - 60000).toISOString());

    if (error) {
        res.status(500).json({ error });
    } else {
        res.status(200).json({ success: true });
    }
}

export const config = {
    runtime: "edge",
};