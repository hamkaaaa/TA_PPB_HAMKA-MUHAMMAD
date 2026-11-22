import { supabase } from "../config/supabaseClient.js";

function ensureClient() {
  if (!supabase) {
    throw new Error(
      "Supabase client is not configured. Please set SUPABASE_URL and SUPABASE_KEY in .env"
    );
  }
}

export const CrateModel = {
  async getAll() {
    ensureClient();
    const { data, error } = await supabase
      .from("dj_crates")
      .select("*, crate_tracks(count)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data.map((crate) => ({
      ...crate,
      track_count: crate.crate_tracks?.[0]?.count ?? 0,
    }));
  },

  async getById(id) {
    ensureClient();
    const { data: crate, error: crateError } = await supabase
      .from("dj_crates")
      .select("*")
      .eq("id", id)
      .single();
    if (crateError) throw crateError;

    const { data: items, error: itemsError } = await supabase
      .from("crate_tracks")
      .select(
        `
        id, position,
        tracks (
          id, title, artist, bpm, musical_key, energy, duration, genre, mood_id, notes,
          moods ( id, name, color_hex )
        )
      `
      )
      .eq("crate_id", id)
      .order("position", { ascending: true });
    if (itemsError) throw itemsError;

    const tracks = (items || [])
      .filter((item) => item.tracks)
      .map((item) => ({
        ...item.tracks,
        crate_item_id: item.id,
        position: item.position,
      }));

    return { ...crate, tracks };
  },

  async create(payload) {
    ensureClient();
    const { data, error } = await supabase
      .from("dj_crates")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, payload) {
    ensureClient();
    const { data, error } = await supabase
      .from("dj_crates")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    ensureClient();
    const { error } = await supabase.from("dj_crates").delete().eq("id", id);
    if (error) throw error;
    return { message: "Crate deleted successfully" };
  },

  async addTrack(crateId, trackId, position = 1) {
    ensureClient();
    const { data, error } = await supabase
      .from("crate_tracks")
      .insert([{ crate_id: crateId, track_id: trackId, position }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async removeTrack(crateId, trackId) {
    ensureClient();
    const { error } = await supabase
      .from("crate_tracks")
      .delete()
      .eq("crate_id", crateId)
      .eq("track_id", trackId);
    if (error) throw error;
    return { message: "Track removed from crate" };
  },
};

