import { CrateModel } from "../models/crateModel.js";

export const CrateController = {
  async getAll(req, res) {
    try {
      const crates = await CrateModel.getAll();
      res.json(crates);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const crate = await CrateModel.getById(req.params.id);
      res.json(crate);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const crate = await CrateModel.create(req.body);
      res.status(201).json(crate);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const crate = await CrateModel.update(req.params.id, req.body);
      res.json(crate);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const result = await CrateModel.remove(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async addTrack(req, res) {
    try {
      const { track_id, position } = req.body;
      const item = await CrateModel.addTrack(req.params.id, track_id, position);
      res.status(201).json(item);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async removeTrack(req, res) {
    try {
      const result = await CrateModel.removeTrack(
        req.params.id,
        req.params.trackId
      );
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

