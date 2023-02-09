"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import RINGS from "vanta/dist/vanta.rings.min.js";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import classNames from "classnames";

const Home = () => {
  const vantaRef = useRef<any>(null);
  const vantaEffect = useRef<any>(null);
  const [state, setState] = useState();
  const router = useRouter();

  useLayoutEffect(() => {
    vantaEffect.current = RINGS({
      el: vantaRef.current,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
    });

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  return (
    <div ref={vantaRef} className={styles.container}>
      <div className="shadow-md bg-gray-light">
        <div
          className={classNames(styles.paper, "bg-slate-100 rounded-md p-5")}
        >
          <h4 className="font-sans text-2xl">Data Flow Tool</h4>
          <h6 className="font-sans text-sm">Get Started</h6>
          <button
            className="py-2 px-3 bg-cyan-500 hover:bg-cyan-600 hover:shadow-cyan-600/50 text-white text-sm font-semibold rounded-md shadow-lg shadow-cyan-500/50 focus:outline-none mt-10"
            onClick={() => router.push("/editor")}
          >
            New flow
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
