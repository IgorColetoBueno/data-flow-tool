"use client";
import TextField from "@/components/input/TextField";
import Modal from "@/components/modals/Modal";
import { BoardDbHandler } from "@/storage/boardDbHandler";
import { RootState } from "@/store";
import { resetDataSlice } from "@/store/dataSlice";
import { resetEditorSlice } from "@/store/editorSlice";
import { closeModal } from "@/store/modalPreviewSlice";
import {
  ArrowLeftOnRectangleIcon,
  ChartPieIcon,
  CheckBadgeIcon,
  ChevronUpDownIcon,
  DocumentArrowUpIcon,
  RectangleGroupIcon,
  Square3Stack3DIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { DragEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const dispatch = useDispatch();

  const nodeIsIntoBoard = (type: string) =>
    state.editor.nodes.some((q) => q.type === type);

  const resetStore = async () => {
    await dispatch(resetDataSlice({ nodes: [] }));
    await dispatch(
      resetEditorSlice({ edges: [], nodes: [], boardId: undefined })
    );
    await dispatch(closeModal());
  };

  const saveBoard = () => {
    BoardDbHandler.save(
      {
        board_from_editor_id: id,
        name: boardName,
        board: state,
      },
      window.indexedDB
    ).then(() => {
      resetStore().then(() => router.push("/"));
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
        <div className="pl-3 pr-10 py-1">
          <TextField
            color="gray"
            id="boardName"
            label="Board name"
            variant={600}
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
          />
        </div>
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
                    <DocumentArrowUpIcon className="w-6 h-6 text-gray-100 transition duration-75 group-hover:text-gray-100" />
                    <span className="ml-3">New flow step</span>
                  </div>
                </li>
              )}
              <li>
                <details open>
                  <summary className="flex cursor-pointer items-center p-2 text-base font-normal text-gray-100 rounded-lg hover:bg-sky-700">
                    <RectangleGroupIcon className="w-6 h-6 text-gray-100 transition duration-75 group-hover:text-gray-100" />
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
                            <TableCellsIcon className="w-6 h-6 text-gray-100 transition duration-75 group-hover:text-gray-100" />
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
                            <ChevronUpDownIcon className="w-6 h-6 text-gray-100 transition duration-75 group-hover:text-gray-100" />
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
                            <Square3Stack3DIcon className="w-6 h-6 text-gray-100 transition duration-75 group-hover:text-gray-100" />
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
                  <ChartPieIcon className="w-6 h-6 text-gray-100 transition duration-75 group-hover:text-gray-100" />
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
                <CheckBadgeIcon className="w-6 h-6 text-gray-100 transition duration-75" />
                <span className="ml-3">Save board</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => resetStore().then(() => router.push("/"))}
                className="w-full flex items-center p-2 text-base font-normal text-gray-100 rounded-lg hover:bg-sky-700"
              >
                <ArrowLeftOnRectangleIcon className="w-6 h-6 text-gray-100 transition duration-75" />
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
