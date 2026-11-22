import { TrackModel } from "../models/trackModel.js";

export const TrackController = {
  async getAll(req, res) {
    try {
      const { mood_id, min_bpm, max_bpm, search } = req.query;
      const tracks = await TrackModel.getAll({
        mood_id,
        min_bpm,
        max_bpm,
        search,
      });
      res.json(tracks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getGenres(req, res) {
    try {
      const genres = await TrackModel.getGenres();
      res.json(genres);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const track = await TrackModel.getById(req.params.id);
      res.json(track);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const track = await TrackModel.create(req.body);
      res.status(201).json(track);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const track = await TrackModel.update(req.params.id, req.body);
      res.json(track);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const result = await TrackModel.remove(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

