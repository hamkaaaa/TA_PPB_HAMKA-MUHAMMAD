import { MoodModel } from "../models/moodModel.js";

export const MoodController = {
  async getAll(req, res) {
    try {
      const moods = await MoodModel.getAll();
      res.json(moods);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const mood = await MoodModel.getById(req.params.id, req.user?.id || null);
      res.json(mood);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const mood = await MoodModel.create(req.body);
      res.status(201).json(mood);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const mood = await MoodModel.update(req.params.id, req.body);
      res.json(mood);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const result = await MoodModel.remove(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

