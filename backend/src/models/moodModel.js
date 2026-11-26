import { supabase } from "../config/supabaseClient.js";

function ensureClient() {
  if (!supabase) {
    throw new Error(
      "Supabase client is not configured. Please set SUPABASE_URL and SUPABASE_KEY in .env"
    );
  }
}

export const MoodModel = {
  async getAll() {
    ensureClient();
    const { data, error } = await supabase
      .from("moods")
      .select("*")
      .order("name", { ascending: true });
    if (error) throw error;
    return data;
  },

  async getById(id, userId = null) {
    ensureClient();
    const { data: mood, error: moodError } = await supabase
      .from("moods")
      .select("*")
      .eq("id", id)
      .single();
    if (moodError) throw moodError;

    let tracksQuery = supabase
      .from("tracks")
      .select(
        "id, title, artist, bpm, musical_key, energy, duration, genre, mood_id, notes, cover_url, user_id, deezer_id"
      )
      .eq("mood_id", id)
      .order("bpm", { ascending: true });

    if (userId) {
      tracksQuery = tracksQuery.or(`user_id.is.null,user_id.eq.${userId}`);
    } else {
      tracksQuery = tracksQuery.is("user_id", null);
    }

    const { data: tracks, error: tracksError } = await tracksQuery;
    if (tracksError) throw tracksError;

    return { ...mood, tracks: tracks || [] };
  },

  async create(payload) {
    ensureClient();
    const { data, error } = await supabase
      .from("moods")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, payload) {
    ensureClient();
    const { data, error } = await supabase
      .from("moods")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    ensureClient();
    const { error } = await supabase.from("moods").delete().eq("id", id);
    if (error) throw error;
    return { message: "Mood deleted successfully" };
  },
};

