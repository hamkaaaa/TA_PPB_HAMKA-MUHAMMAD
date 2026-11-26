import { UserModel } from "../models/userModel.js";
import { hashPassword, verifyPassword, signToken } from "../utils/auth.js";

const USERNAME_REGEX = /^[a-zA-Z0-9_.-]+$/;

function toPublicUser(user) {
  return {
    id: user.id,
    username: user.username,
    display_name: user.display_name || user.username,
    created_at: user.created_at,
  };
}

export const AuthController = {
  async register(req, res) {
    try {
      const { username = "", password = "", display_name = "" } = req.body || {};
      const cleanUsername = String(username).trim().toLowerCase();

      if (
        cleanUsername.length < 3 ||
        cleanUsername.length > 30 ||
        !USERNAME_REGEX.test(cleanUsername)
      ) {
        return res.status(400).json({
          error:
            "Username harus 3–30 karakter dan hanya boleh berisi huruf, angka, titik, underscore, atau strip.",
        });
      }

      if (typeof password !== "string" || password.length < 6) {
        return res.status(400).json({
          error: "Password minimal 6 karakter.",
        });
      }

      const existing = await UserModel.findByUsername(cleanUsername);
      if (existing) {
        return res.status(409).json({
          error: "Username sudah terdaftar. Silakan gunakan username lain.",
        });
      }

      const password_hash = hashPassword(password);
      const user = await UserModel.create({
        username: cleanUsername,
        display_name: String(display_name).trim() || cleanUsername,
        password_hash,
      });

      const publicUser = toPublicUser(user);
      const token = signToken({
        sub: publicUser.id,
        username: publicUser.username,
        display_name: publicUser.display_name,
      });

      res.status(201).json({ token, user: publicUser });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async login(req, res) {
    try {
      const { username = "", password = "" } = req.body || {};
      const cleanUsername = String(username).trim().toLowerCase();

      if (!cleanUsername || typeof password !== "string" || !password) {
        return res.status(400).json({
          error: "Username dan password wajib diisi.",
        });
      }

      const user = await UserModel.findByUsername(cleanUsername);
      if (!user || !verifyPassword(password, user.password_hash)) {
        return res.status(401).json({
          error: "Username atau password salah.",
        });
      }

      const publicUser = toPublicUser(user);
      const token = signToken({
        sub: publicUser.id,
        username: publicUser.username,
        display_name: publicUser.display_name,
      });

      res.json({ token, user: publicUser });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async me(req, res) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(401).json({ error: "Sesi tidak valid." });
      }
      res.json({ user: toPublicUser(user) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
