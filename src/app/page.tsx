"use client";

import { BoardDbHandler } from "@/storage/boardDbHandler";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { generateUUID } from "three/src/math/MathUtils";
import RINGS from "vanta/dist/vanta.rings.min.js";
import styles from "./page.module.css";

const Home = () => {
  const vantaRef = useRef<any>(null);
  const vantaEffect = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
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

  const newFlow = () => {
    const newId = generateUUID();
    BoardDbHandler.save(
      { board_from_editor_id: newId, name: "" },
      window.indexedDB
    ).then(() => router.push(`/home/${newId}`));
  };

  return (
    <div ref={vantaRef} className={styles.container}>
      <div className="shadow-md bg-gray-light">
        <div
          className={
            "bg-white-800 flex justify-between flex-row rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-90 border border-gray-300 p-2"
          }
        >
          <div className="flex flex-col p-[20px] w-64">
            <h4 className="font-sans text-3xl text-white">Data Flow Tool</h4>
            <h6 className="font-sans text-white text-sm">Get Started</h6>
            <button
              onClick={newFlow}
              className="py-2 px-3 text-center margin bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-md focus:outline-none mt-10"
            >
              New flow
            </button>
          </div>

          <div className="p-[20px] w-96 border-l border-gray-50">
            <span className="text-gray-50 text-2xl">Open existing board</span>
            <ul className="space-y-2 mt-3">
              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-md font-normal rounded-lg text-gray-50 bg-gray-600 hover:bg-gray-700 font-semibold"
                >
                  <span>Dashboard</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
