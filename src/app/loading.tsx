"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import WAVES from "vanta/dist/vanta.waves.min.js";

const Loading = () => {
  const vantaRef = useRef<any>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    vantaEffect.current = WAVES({
      el: vantaRef.current,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      waveHeight: 30.0,
    });
  });

  return (
    <div ref={vantaRef} className="h-full w-full">
      <div className="flex items-center justify-center h-full">
        <h1 className="text-gray-50 text-7xl">Loading...</h1>
      </div>
    </div>
  );
};

export default Loading;
