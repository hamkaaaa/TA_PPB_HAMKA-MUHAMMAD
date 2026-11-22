const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:3000/api"
).replace(/\/$/, "");

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  baseUrl: API_BASE,

  // Health check
  health: () => fetch(API_BASE.replace(/\/api$/, "")).then((r) => r.json()),

  // Tracks
  getTracks: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, v);
    });
    const query = qs.toString();
    return request(`/tracks${query ? `?${query}` : ""}`);
  },
  getTrackById: (id) => request(`/tracks/${id}`),
  getGenres: () => request("/tracks/genres"),
  createTrack: (payload) =>
    request("/tracks", { method: "POST", body: JSON.stringify(payload) }),
  updateTrack: (id, payload) =>
    request(`/tracks/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteTrack: (id) => request(`/tracks/${id}`, { method: "DELETE" }),

  // Moods
  getMoods: () => request("/moods"),
  getMoodById: (id) => request(`/moods/${id}`),
  createMood: (payload) =>
    request("/moods", { method: "POST", body: JSON.stringify(payload) }),

  // Crates
  getCrates: () => request("/crates"),
  getCrateById: (id) => request(`/crates/${id}`),
  createCrate: (payload) =>
    request("/crates", { method: "POST", body: JSON.stringify(payload) }),
  deleteCrate: (id) => request(`/crates/${id}`, { method: "DELETE" }),
  addTrackToCrate: (crateId, trackId, position = 1) =>
    request(`/crates/${crateId}/tracks`, {
      method: "POST",
      body: JSON.stringify({ track_id: trackId, position }),
    }),
  removeTrackFromCrate: (crateId, trackId) =>
    request(`/crates/${crateId}/tracks/${trackId}`, { method: "DELETE" }),
};

