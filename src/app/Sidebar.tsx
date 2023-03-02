"use client";
import Modal from "@/components/modals/Modal";
import { BoardDbHandler } from "@/storage/boardDbHandler";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { DragEvent, useState } from "react";
import { useSelector } from "react-redux";
interface ISidebarProps {
  id: string;
}

const Sidebar = ({ id }: ISidebarProps) => {
  const state = useSelector((state: RootState) => state);
  const [exitOpen, setExitOpen] = useState(false);
  const [savingOpen, setSavingOpen] = useState(false);
  const [boardName, setBoardName] = useState("");
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  const router = useRouter();

  const nodeIsIntoBoard = (type: string) =>
    state.editor.nodes.some((q) => q.type === type);

  const saveBoard = () => {
    debugger;
    BoardDbHandler.save(
      {
        board_from_editor_id: id,
        name: boardName,
        board: state,
      },
      window.indexedDB
    ).then(() => {
      router.push("/");
    });
  };
  return (
    <>
      <Modal
        footer={
          <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              onClick={() => setExitOpen(false)}
              data-modal-hide="defaultModal"
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                router.push("/");
                setExitOpen(false);
              }}
              data-modal-hide="defaultModal"
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              OK
            </button>
          </div>
        }
        onClose={() => setExitOpen(false)}
        open={exitOpen}
        title="Are you sure you want come back to home?"
      >
        <p>Unsaved changes will not be saved</p>
      </Modal>
      <Modal
        footer={
          <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              onClick={() => {
                setSavingOpen(false);
              }}
              data-modal-hide="defaultModal"
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Cancel
            </button>
            <button
              onClick={saveBoard}
              data-modal-hide="defaultModal"
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              OK
            </button>
          </div>
        }
        onClose={() => setSavingOpen(false)}
        open={savingOpen}
        title="Do you want to save?"
      >
        <input
          placeholder="Board name"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
        />
      </Modal>
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-sky-900 flex flex-col justify-between">
          <div>
            <h1 className="text-gray-100 !text-6xl mb-10">DFT</h1>
            <ul className="space-y-2">
              {!nodeIsIntoBoard("inputNode") && (
                <li>
                  <div
                    onDragStart={(event) => onDragStart(event, "inputNode")}
                    draggable
                    className="flex items-center p-2 text-base font-normal text-gray-100 rounded-lg hover:bg-sky-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-gray-100 transition duration-75"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                      />
                    </svg>

                    <span className="ml-3">New data source</span>
                  </div>
                </li>
              )}
              <li>
                <details>
                  <summary className="flex cursor-pointer items-center p-2 text-base font-normal text-gray-100 rounded-lg hover:bg-sky-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-gray-100 transition duration-75 group-hover:text-gray-100"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z"
                      />
                    </svg>
                    <span className="ml-3">New flow step</span>
                  </summary>
                  <div className="text-base font-normal text-gray-100 ml-10">
                    <ul className="space-y-2">
                      {!nodeIsIntoBoard("selectNode") && (
                        <li>
                          <div
                            onDragStart={(event) =>
                              onDragStart(event, "selectNode")
                            }
                            draggable
                            className="flex items-center p-2 text-base font-normal text-gray-100 rounded-lg hover:bg-sky-700"
                          >
                            <svg
                              fill="none"
                              className="w-6 h-6 text-gray-100 transition duration-75 group-hover:text-gray-100"
                              stroke="currentColor"
                              strokeWidth={1.5}
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
                              />
                            </svg>
                            <span className="ml-3">New select</span>
                          </div>
                        </li>
                      )}
                      {!nodeIsIntoBoard("sortNode") && (
                        <li>
                          <div
                            onDragStart={(event) =>
                              onDragStart(event, "sortNode")
                            }
                            draggable
                            className="flex items-center p-2 text-base font-normal text-gray-100 rounded-lg hover:bg-sky-700"
                          >
                            <svg
                              fill="none"
                              stroke="currentColor"
                              className="w-6 h-6 text-gray-100 transition duration-75 group-hover:text-gray-100"
                              strokeWidth={1.5}
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                              />
                            </svg>
                            <span className="ml-3">New sort</span>
                          </div>
                        </li>
                      )}
                      {!nodeIsIntoBoard("groupNode") && (
                        <li>
                          <div
                            onDragStart={(event) =>
                              onDragStart(event, "groupNode")
                            }
                            draggable
                            className="flex items-center p-2 text-base font-normal text-gray-100 rounded-lg hover:bg-sky-700"
                          >
                            <svg
                              fill="none"
                              stroke="currentColor"
                              className="w-6 h-6 text-gray-100 transition duration-75 group-hover:text-gray-100"
                              strokeWidth={1.5}
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
                              />
                            </svg>
                            <span className="ml-3">New group</span>
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                </details>
              </li>
              <li>
                <div
                  onDragStart={(event) => onDragStart(event, "outputNode")}
                  draggable
                  className="flex items-center p-2 text-base font-normal text-gray-100 rounded-lg hover:bg-sky-700"
                >
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6 text-gray-100 transition duration-75 group-hover:text-gray-100"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                  </svg>
                  <span className="ml-3">New output</span>
                </div>
              </li>
            </ul>
          </div>
          <ul>
            <li>
              <button
                onClick={() => setSavingOpen(true)}
                className="w-full flex items-center p-2 text-base font-normal text-gray-100 rounded-lg hover:bg-sky-700"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-6 h-6 text-gray-100 transition duration-75"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                  />
                </svg>

                <span className="ml-3">Save board</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => alert("teste")}
                className="w-full flex items-center p-2 text-base font-normal text-gray-100 rounded-lg hover:bg-sky-700"
              >
                <svg
                  className="w-6 h-6 text-gray-100 transition duration-75"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
                <span className="ml-3">Back to home</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
