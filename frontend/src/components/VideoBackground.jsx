import React, { useEffect, useState } from "react";

export default function VideoBackground() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fade in the overlay for a smooth transition
    const timer = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
      {/* 🎥 Primary Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src="/videos/nk-bg-optimized.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🌒 Secondary Overlay (gold tint + fade-in) */}
      <div
        className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
          visible ? "opacity-80 bg-[#FFD166]/20" : "opacity-0"
        }`}
      />
    </div>
  );
}
