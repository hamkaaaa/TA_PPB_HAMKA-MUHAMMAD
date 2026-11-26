import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import BottomNav from "./components/BottomNav";
import ProtectedRoute from "./components/ProtectedRoute";
import TracksPage from "./pages/TracksPage";
import TrackDetailPage from "./pages/TrackDetailPage";
import MoodsPage from "./pages/MoodsPage";
import MoodDetailPage from "./pages/MoodDetailPage";
import CratesPage from "./pages/CratesPage";
import CrateDetailPage from "./pages/CrateDetailPage";
import AddTrackPage from "./pages/AddTrackPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
          <main className="mx-auto min-h-screen max-w-md px-4 pb-24 pt-5">
            <Routes>
              <Route path="/" element={<TracksPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/tracks/:id" element={<TrackDetailPage />} />
              <Route
                path="/tracks/:id/edit"
                element={
                  <ProtectedRoute>
                    <AddTrackPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/moods" element={<MoodsPage />} />
              <Route path="/moods/:id" element={<MoodDetailPage />} />
              <Route
                path="/crates"
                element={
                  <ProtectedRoute>
                    <CratesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/crates/:id"
                element={
                  <ProtectedRoute>
                    <CrateDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add"
                element={
                  <ProtectedRoute>
                    <AddTrackPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
