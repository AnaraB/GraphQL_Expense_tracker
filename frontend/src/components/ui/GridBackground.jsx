import React from "react";

export function GridBackground({children}) {
  return (
    (<div
      className="w-full bg-black text-white bg-grid-white/[0.2] relative">
      {/* Radial gradient for the container to give a faded look */}
      <div
        className="absolute pointer-events-none inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      {children}
    </div>)
  );
}
