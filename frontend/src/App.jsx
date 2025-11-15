import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import VideoBackground from "./components/VideoBackground.jsx";
import Hub from "./pages/Hub.jsx";
import TranscribePage from "./pages/TranscribePage.jsx";

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen overflow-hidden">
        {/* Primary background */}
        <VideoBackground />
        
        {/* Header - will be on all pages */}
        <Header />
        
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Hub />} />
          <Route path="/hub" element={<Hub />} />
          <Route path="/transcribe" element={<TranscribePage />} />
          <Route path="/core" element={<ComingSoon page="Core" />} />
          <Route path="/gear" element={<ComingSoon page="Gear" />} />
          <Route path="/blueprint" element={<ComingSoon page="Blueprint" />} />
        </Routes>
      </div>
    </Router>
  );
}

// Temporary placeholder for unbuilt pages
function ComingSoon({ page }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-20">
      <div className="bg-[#FFD166] text-[#1A1A1A] p-10 rounded-xl shadow-xl max-w-xl">
        <h1 className="text-4xl font-bold mb-4">{page}</h1>
        <p className="text-lg">Coming Soon...</p>
      </div>
    </div>
  );
}