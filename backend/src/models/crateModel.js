import { supabase } from "../config/supabaseClient.js";

function ensureClient() {
  if (!supabase) {
    throw new Error(
      "Supabase client is not configured. Please set SUPABASE_URL and SUPABASE_KEY in .env"
    );
  }
}

function createHttpError(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}

export const CrateModel = {
  async getAll(userId) {
    ensureClient();
    const { data, error } = await supabase
      .from("dj_crates")
      .select("*, crate_tracks(count)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data.map((crate) => ({
      ...crate,
      track_count: crate.crate_tracks?.[0]?.count ?? 0,
    }));
  },

  async getById(id, userId) {
    ensureClient();
    const { data: crate, error: crateError } = await supabase
      .from("dj_crates")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();
    if (crateError) throw crateError;

    const { data: items, error: itemsError } = await supabase
      .from("crate_tracks")
      .select(
        `
        id, position,
        tracks (
          id, title, artist, bpm, musical_key, energy, duration, genre, mood_id, notes, cover_url, user_id, deezer_id,
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

  async create(payload, userId) {
    ensureClient();
    const nextPayload = { ...payload, user_id: userId };
    const { data, error } = await supabase
      .from("dj_crates")
      .insert([nextPayload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, payload, userId) {
    ensureClient();
    const nextPayload = { ...payload };
    delete nextPayload.user_id;
    const { data, error } = await supabase
      .from("dj_crates")
      .update(nextPayload)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id, userId) {
    ensureClient();
    const { data: existing, error: fetchError } = await supabase
      .from("dj_crates")
      .select("id")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();
    if (fetchError) throw fetchError;
    if (!existing) {
      throw createHttpError("Crate tidak ditemukan.", 404);
    }
    const { error } = await supabase
      .from("dj_crates")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    if (error) throw error;
    return { message: "Crate deleted successfully" };
  },

  async addTrack(crateId, trackId, position = 1, userId) {
    ensureClient();
    const { data: crate, error: crateErr } = await supabase
      .from("dj_crates")
      .select("id")
      .eq("id", crateId)
      .eq("user_id", userId)
      .maybeSingle();
    if (crateErr) throw crateErr;
    if (!crate) {
      throw createHttpError("Crate tidak ditemukan atau bukan milik Anda.", 404);
    }

    const { data: track, error: trackErr } = await supabase
      .from("tracks")
      .select("id, user_id")
      .eq("id", trackId)
      .maybeSingle();
    if (trackErr) throw trackErr;
    if (!track || (track.user_id !== null && track.user_id !== userId)) {
      throw createHttpError("Lagu tidak dapat diakses.", 404);
    }

    const { data, error } = await supabase
      .from("crate_tracks")
      .insert([{ crate_id: crateId, track_id: trackId, position }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async removeTrack(crateId, trackId, userId) {
    ensureClient();
    const { data: crate, error: crateErr } = await supabase
      .from("dj_crates")
      .select("id")
      .eq("id", crateId)
      .eq("user_id", userId)
      .maybeSingle();
    if (crateErr) throw crateErr;
    if (!crate) {
      throw createHttpError("Crate tidak ditemukan atau bukan milik Anda.", 404);
    }

    const { error } = await supabase
      .from("crate_tracks")
      .delete()
      .eq("crate_id", crateId)
      .eq("track_id", trackId);
    if (error) throw error;
    return { message: "Track removed from crate" };
  },
};
