import { supabase } from "../config/supabaseClient.js";

function ensureClient() {
  if (!supabase) {
    throw new Error(
      "Supabase client is not configured. Please set SUPABASE_URL and SUPABASE_KEY in .env"
    );
  }
}

export const TrackModel = {
  async getAll(filters = {}) {
    ensureClient();
    let query = supabase
      .from("tracks")
      .select(
        `
        id, title, artist, bpm, musical_key, energy, duration, genre, mood_id, notes, cover_url, created_at,
        moods ( id, name, color_hex )
      `
      )
      .order("bpm", { ascending: true });

    if (filters.mood_id) {
      query = query.eq("mood_id", filters.mood_id);
    }
    if (filters.min_bpm) {
      query = query.gte("bpm", Number(filters.min_bpm));
    }
    if (filters.max_bpm) {
      query = query.lte("bpm", Number(filters.max_bpm));
    }
    if (filters.search) {
      const term = `%${filters.search}%`;
      query = query.or(
        `title.ilike.${term},artist.ilike.${term},genre.ilike.${term},musical_key.ilike.${term}`
      );
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id) {
    ensureClient();
    const { data, error } = await supabase
      .from("tracks")
      .select(
        `
        id, title, artist, bpm, musical_key, energy, duration, genre, mood_id, notes, cover_url, created_at,
        moods ( id, name, description, bpm_range, color_hex )
      `
      )
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async getGenres() {
    ensureClient();
    const { data, error } = await supabase.from("tracks").select("genre");
    if (error) throw error;

    const counts = new Map();
    for (const row of data || []) {
      const raw = row.genre?.trim();
      if (!raw) continue;
      const key = raw.toLowerCase();
      if (!counts.has(key)) {
        counts.set(key, new Map());
      }
      const variants = counts.get(key);
      variants.set(raw, (variants.get(raw) || 0) + 1);
    }

    const genres = [];
    for (const variants of counts.values()) {
      let best = "";
      let bestCount = -1;
      for (const [name, count] of variants.entries()) {
        if (count > bestCount) {
          best = name;
          bestCount = count;
        }
      }
      if (best) genres.push(best);
    }

    return genres.sort((a, b) => a.localeCompare(b));
  },

  async normalizeGenre(genre) {
    if (typeof genre !== "string") return genre;
    const trimmed = genre.trim();
    if (!trimmed) return trimmed;
    const existing = await this.getGenres();
    const match = existing.find(
      (g) => g.toLowerCase() === trimmed.toLowerCase()
    );
    return match || trimmed;
  },

  async create(payload) {
    ensureClient();
    const nextPayload = { ...payload };
    if (nextPayload.genre !== undefined) {
      nextPayload.genre = await this.normalizeGenre(nextPayload.genre);
    }
    const { data, error } = await supabase
      .from("tracks")
      .insert([nextPayload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, payload) {
    ensureClient();
    const nextPayload = { ...payload };
    if (nextPayload.genre !== undefined) {
      nextPayload.genre = await this.normalizeGenre(nextPayload.genre);
    }
    const { data, error } = await supabase
      .from("tracks")
      .update(nextPayload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    ensureClient();
    const { error } = await supabase.from("tracks").delete().eq("id", id);
    if (error) throw error;
    return { message: "Track deleted successfully" };
  },
};

