"use client";

import { EXTERNAL_KEY_BOARD_FROM_EDITOR } from "@/storage";
import { BoardDbHandler, IBoard } from "@/storage/boardDbHandler";
import { DataDbHandler } from "@/storage/dataDbHandler";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { generateUUID } from "three/src/math/MathUtils";
import RINGS from "vanta/dist/vanta.rings.min.js";

const Home = () => {
  const vantaRef = useRef<any>(null);
  const vantaEffect = useRef<any>(null);
  const router = useRouter();
  const [boards, setBoards] = useState<IBoard[]>([]);

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

    refreshDb();

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  const refreshDb = () => {
    BoardDbHandler.getAll().then((result) => setBoards(result));
  };

  const newFlow = () => {
    const newId = generateUUID();
    BoardDbHandler.save({ board_from_editor_id: newId, name: "Untitled" }).then(
      () => router.push(`/home/${newId}`)
    );
  };

  const deleteFlow = async (key: string) => {
    try {
      await Promise.all([
        BoardDbHandler.remove(key),
        DataDbHandler.removeByIndex({
          value: key,
          index: EXTERNAL_KEY_BOARD_FROM_EDITOR,
        }),
      ]);
      refreshDb();
    } catch (error) {
      alert("An error ocurred");
    }
  };

  return (
    <div
      ref={vantaRef}
      className="flex justify-center items-center h-full w-full"
    >
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
              {boards.map((board) => (
                <li key={`board-${board.board_from_editor_id}`}>
                  <Link
                    href={`/home/${board.board_from_editor_id}`}
                    className="flex items-center p-2 text-md font-normal rounded-lg text-gray-900 bg-gray-200 hover:bg-gray-300 font-semibold flex justify-between"
                  >
                    <span>{board.name}</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deleteFlow(board.board_from_editor_id);
                      }}
                      type="button"
                      className="text-red-600 hover:text-white border border-red-500 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2 text-center"
                    >
                      <XMarkIcon strokeWidth={3} className="w-3 h-3" />
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
