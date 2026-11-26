import { TrackModel } from "../models/trackModel.js";

export const TrackController = {
  async getAll(req, res) {
    try {
      const { mood_id, min_bpm, max_bpm, search, scope } = req.query;
      const tracks = await TrackModel.getAll(
        { mood_id, min_bpm, max_bpm, search, scope },
        req.user?.id || null
      );
      res.json(tracks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getGenres(req, res) {
    try {
      const genres = await TrackModel.getGenres(req.user?.id || null);
      res.json(genres);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const track = await TrackModel.getById(req.params.id, req.user?.id || null);
      res.json(track);
    } catch (err) {
      res.status(err.status || 404).json({ error: err.message });
    }
  },

  async getPreview(req, res) {
    try {
      const track = await TrackModel.getById(req.params.id, req.user?.id || null);
      if (!track.deezer_id) {
        return res.json({ preview_url: null });
      }
      const response = await fetch(
        `https://api.deezer.com/track/${track.deezer_id}`
      );
      if (!response.ok) {
        return res.json({ preview_url: null });
      }
      const data = await response.json();
      res.json({ preview_url: data?.preview || null });
    } catch (err) {
      res.status(err.status || 404).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const track = await TrackModel.create(req.body, req.user.id);
      res.status(201).json(track);
    } catch (err) {
      res.status(err.status || 400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const track = await TrackModel.update(req.params.id, req.body, req.user.id);
      res.json(track);
    } catch (err) {
      res.status(err.status || 400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const result = await TrackModel.remove(req.params.id, req.user.id);
      res.json(result);
    } catch (err) {
      res.status(err.status || 400).json({ error: err.message });
    }
  },
};
