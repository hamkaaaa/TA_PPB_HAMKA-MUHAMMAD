import { supabase } from "../config/supabaseClient.js";

function ensureClient() {
  if (!supabase) {
    throw new Error(
      "Supabase client is not configured. Please set SUPABASE_URL and SUPABASE_KEY in .env"
    );
  }
}

export const UserModel = {
  async findByUsername(username) {
    ensureClient();
    const normalized = username.trim().toLowerCase();
    const { data, error } = await supabase
      .from("users")
      .select("id, username, display_name, password_hash, created_at")
      .eq("username", normalized)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async findById(id) {
    ensureClient();
    const { data, error } = await supabase
      .from("users")
      .select("id, username, display_name, created_at")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create({ username, display_name, password_hash }) {
    ensureClient();
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          username: username.trim().toLowerCase(),
          display_name: display_name?.trim() || username.trim(),
          password_hash,
        },
      ])
      .select("id, username, display_name, created_at")
      .single();
    if (error) throw error;
    return data;
  },
};
