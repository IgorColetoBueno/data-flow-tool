"use client";
import TextField from "@/components/input/TextField";
import Modal from "@/components/modals/Modal";
import { useDebounce } from "@/hooks/useDebounce";
import { BoardDbHandler } from "@/storage/boardDbHandler";
import store, { RootState } from "@/store";
import { clearAllNodeData } from "@/store/dataSlice";
import {
  ArrowLeftOnRectangleIcon,
  CheckBadgeIcon,
  ChevronUpDownIcon,
  DocumentArrowUpIcon,
  DocumentTextIcon,
  PresentationChartLineIcon,
  RectangleGroupIcon,
  Square3Stack3DIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { DragEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
interface ISidebarProps {
  id: string;
}

const Sidebar = ({ id }: ISidebarProps) => {
  const [exitOpen, setExitOpen] = useState(false);
  const [savingOpen, setSavingOpen] = useState(false);
  const [boardName, setBoardName] = useState("");
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  const boardState = useSelector((state: RootState) => state);
  const debouncedBoardState = useDebounce<RootState>(boardState, 700);
  const router = useRouter();
  const dispatch = useDispatch();

  const nodeIsIntoBoard = (type: string) =>
    boardState.editor.nodes.some((q) => q.type === type);

  const saveBoard = () => {
    BoardDbHandler.save({
      board_from_editor_id: id,
      name: boardName,
      board: boardState,
    }).then(() => {
      setSavingOpen(false);
    });
  };

  useEffect(() => {
    BoardDbHandler.getOne(id).then((res) => setBoardName(res.name));
  }, [id]);

  useEffect(() => {
    if (!!boardName) saveBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedBoardState]);

  return (
    <>
      <Modal
        footer={
          <div className="flex items-center justify-end p-6 space-x-2 rounded-b">
            <button
              onClick={() => setExitOpen(false)}
              data-modal-hide="defaultModal"
              type="button"
              className="text-white border border-gray-500 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                await dispatch(clearAllNodeData());
                router.push("/");
              }}
              data-modal-hide="defaultModal"
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
          <div className="flex items-center justify-end p-6 space-x-2 rounded-b">
            <button
              onClick={() => {
                setSavingOpen(false);
              }}
              data-modal-hide="defaultModal"
              type="button"
              className="text-white border border-gray-500 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Cancel
            </button>
            <button
              onClick={() => saveBoard()}
              data-modal-hide="defaultModal"
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
                    <span className="ml-3">New input step</span>
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
                <details open>
                  <summary className="flex cursor-pointer items-center p-2 text-base font-normal text-gray-100 rounded-lg hover:bg-sky-700">
                    <RectangleGroupIcon className="w-6 h-6 text-gray-100 transition duration-75 group-hover:text-gray-100" />
                    <span className="ml-3">New output</span>
                  </summary>
                  <div className="text-base font-normal text-gray-100 ml-10">
                    <ul className="space-y-2">
                      <li>
                        <div
                          onDragStart={(event) =>
                            onDragStart(event, "reportNode")
                          }
                          draggable
                          className="flex items-center p-2 text-base font-normal text-gray-100 rounded-lg hover:bg-sky-700"
                        >
                          <DocumentTextIcon className="w-6 h-6 text-gray-100 transition duration-75 group-hover:text-gray-100" />
                          <span className="ml-3">New report</span>
                        </div>
                      </li>

                      <li>
                        <div
                          onDragStart={(event) =>
                            onDragStart(event, "lineChartNode")
                          }
                          draggable
                          className="flex items-center p-2 text-base font-normal text-gray-100 rounded-lg hover:bg-sky-700"
                        >
                          <PresentationChartLineIcon className="w-6 h-6 text-gray-100 transition duration-75 group-hover:text-gray-100" />
                          <span className="ml-3">New line chart</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </details>
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
                onClick={() => {
                  setExitOpen(true);
                }}
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
