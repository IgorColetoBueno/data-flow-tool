"use client";

import classNames from "classnames";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import RINGS from "vanta/dist/vanta.rings.min.js";
import styles from "./page.module.css";

const Home = () => {
  const vantaRef = useRef<any>(null);
  const vantaEffect = useRef<any>(null);

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
          className={classNames(
            styles.paper,
            "bg-white-800 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 border border-gray-300 p-5"
          )}
        >
          <h4 className="font-sans text-3xl text-white">Data Flow Tool</h4>
          <h6 className="font-sans text-white text-sm">Get Started</h6>
          <Link
            href={"/home"}
            className="py-2 px-3 text-center margin bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-md focus:outline-none mt-10"
          >
            New flow
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
