import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import TracksPage from "./pages/TracksPage";
import TrackDetailPage from "./pages/TrackDetailPage";
import MoodsPage from "./pages/MoodsPage";
import MoodDetailPage from "./pages/MoodDetailPage";
import CratesPage from "./pages/CratesPage";
import CrateDetailPage from "./pages/CrateDetailPage";
import AddTrackPage from "./pages/AddTrackPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <main className="mx-auto min-h-screen max-w-md px-4 pb-24 pt-5">
          <Routes>
            <Route path="/" element={<TracksPage />} />
            <Route path="/tracks/:id" element={<TrackDetailPage />} />
            <Route path="/tracks/:id/edit" element={<AddTrackPage />} />
            <Route path="/moods" element={<MoodsPage />} />
            <Route path="/moods/:id" element={<MoodDetailPage />} />
            <Route path="/crates" element={<CratesPage />} />
            <Route path="/crates/:id" element={<CrateDetailPage />} />
            <Route path="/add" element={<AddTrackPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

