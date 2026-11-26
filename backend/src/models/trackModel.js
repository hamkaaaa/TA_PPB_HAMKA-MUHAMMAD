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

export const TrackModel = {
  async getAll(filters = {}, userId = null) {
    ensureClient();
    let query = supabase
      .from("tracks")
      .select(
        `
        id, title, artist, bpm, musical_key, energy, duration, genre, mood_id, notes, cover_url, user_id, deezer_id, created_at,
        moods ( id, name, color_hex )
      `
      )
      .order("bpm", { ascending: true });

    if (filters.scope === "default" || !userId) {
      query = query.is("user_id", null);
    } else if (filters.scope === "mine" && userId) {
      query = query.eq("user_id", userId);
    } else if (userId) {
      query = query.or(`user_id.is.null,user_id.eq.${userId}`);
    }

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

  async getById(id, userId = null) {
    ensureClient();
    const { data, error } = await supabase
      .from("tracks")
      .select(
        `
        id, title, artist, bpm, musical_key, energy, duration, genre, mood_id, notes, cover_url, user_id, deezer_id, created_at,
        moods ( id, name, description, bpm_range, color_hex )
      `
      )
      .eq("id", id)
      .single();
    if (error) throw error;
    if (data.user_id !== null && data.user_id !== userId) {
      throw createHttpError("Lagu tidak ditemukan", 404);
    }
    return data;
  },

  async getGenres(userId = null) {
    ensureClient();
    let query = supabase.from("tracks").select("genre");
    if (userId) {
      query = query.or(`user_id.is.null,user_id.eq.${userId}`);
    } else {
      query = query.is("user_id", null);
    }
    const { data, error } = await query;
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

  async normalizeGenre(genre, userId = null) {
    if (typeof genre !== "string") return genre;
    const trimmed = genre.trim();
    if (!trimmed) return trimmed;
    const existing = await this.getGenres(userId);
    const match = existing.find(
      (g) => g.toLowerCase() === trimmed.toLowerCase()
    );
    return match || trimmed;
  },

  async create(payload, userId) {
    ensureClient();
    const nextPayload = { ...payload };
    delete nextPayload.deezer_id;
    nextPayload.user_id = userId;
    if (nextPayload.genre !== undefined) {
      nextPayload.genre = await this.normalizeGenre(nextPayload.genre, userId);
    }
    const { data, error } = await supabase
      .from("tracks")
      .insert([nextPayload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, payload, userId) {
    ensureClient();
    const { data: existing, error: fetchError } = await supabase
      .from("tracks")
      .select("id, user_id")
      .eq("id", id)
      .single();
    if (fetchError || !existing) {
      throw createHttpError("Lagu tidak ditemukan.", 404);
    }
    if (existing.user_id === null) {
      throw createHttpError("Lagu default tidak dapat diubah.", 403);
    }
    if (existing.user_id !== userId) {
      throw createHttpError("Anda tidak memiliki izin mengubah lagu ini.", 403);
    }

    const nextPayload = { ...payload };
    delete nextPayload.user_id;
    delete nextPayload.deezer_id;
    if (nextPayload.genre !== undefined) {
      nextPayload.genre = await this.normalizeGenre(nextPayload.genre, userId);
    }
    const { data, error } = await supabase
      .from("tracks")
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
      .from("tracks")
      .select("id, user_id")
      .eq("id", id)
      .single();
    if (fetchError || !existing) {
      throw createHttpError("Lagu tidak ditemukan.", 404);
    }
    if (existing.user_id === null) {
      throw createHttpError("Lagu default tidak dapat dihapus.", 403);
    }
    if (existing.user_id !== userId) {
      throw createHttpError("Anda tidak memiliki izin menghapus lagu ini.", 403);
    }

    const { error } = await supabase
      .from("tracks")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    if (error) throw error;
    return { message: "Track deleted successfully" };
  },
};
