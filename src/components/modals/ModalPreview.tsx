import { RootState } from "@/store";
import { closeModal } from "@/store/modalPreviewSlice";
import classNames from "classnames";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";

interface IModalPreviewProps {}

const ModalPreview = ({}: IModalPreviewProps) => {
  const { title, data, open } = useSelector(
    (state: RootState) => state.modalPreview
  );
  const dispatch = useDispatch();
  const dataToDisplay = useMemo(() => {
    return data;
  }, [data]);
  const isArray = Array.isArray(dataToDisplay?.output);

  const renderTable = useCallback(() => {
    if (!dataToDisplay?.output.length) return <p>No data to display</p>;

    const keys = dataToDisplay.columns
      .filter((q) => q.checked)
      .map((col) => col.newName);

    return (
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
          <tr>
            {keys.map((key, index) => (
              <th
                scope="col"
                className="px-6 py-3 bg-gray-50 dark:bg-gray-800"
                key={key + index}
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(dataToDisplay.output as any[]).map((item, index) => (
            <tr
              className="border-b border-gray-200 dark:border-gray-700"
              key={`item-${index}`}
            >
              {keys.map((key, keyIndex) => (
                <td
                  scope="row"
                  className={classNames(
                    index % 2 === 1
                      ? "px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                      : "px-6 py-4"
                  )}
                  key={key + index + keyIndex}
                >
                  {typeof item[key] === "object"
                    ? JSON.stringify(item[key])
                    : item[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }, [dataToDisplay]);

  const renderGroupedTable = useCallback(() => {
    const groupedKeys = Object.keys(dataToDisplay?.output || {});

    if (!groupedKeys.length) return <p>No data to display</p>;

    const keys = (dataToDisplay?.columns || [])
      .filter((q) => q.checked)
      .map((col) => col.newName);

    return (
      <div className="space-y-2">
        {groupedKeys.map((groupedKey, index) => (
          <div key={`grouped-item-${index}`}>
            <p className="text-base text-gray-50 mb-2 text-lg font-semibold">
              {groupedKey}
            </p>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                <tr>
                  {keys.map((key, index) => (
                    <th
                      scope="col"
                      className="px-6 py-3 bg-gray-50 dark:bg-gray-800"
                      key={key + index}
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(
                  (Object.getOwnPropertyDescriptor(
                    dataToDisplay?.output,
                    groupedKey
                  )?.value as any[]) || []
                ).map((item, index) => (
                  <tr
                    className="border-b border-gray-200 dark:border-gray-700"
                    key={`item-${index}`}
                  >
                    {keys.map((key, keyIndex) => (
                      <td
                        scope="row"
                        className={classNames(
                          index % 2 === 1
                            ? "px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                            : "px-6 py-4"
                        )}
                        key={key + index + keyIndex}
                      >
                        {typeof item[key] === "object"
                          ? JSON.stringify(item[key])
                          : item[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  }, [dataToDisplay]);

  return (
    <Modal
      title={title}
      open={open || false}
      onClose={() => dispatch(closeModal())}
    >
      <div className="relative max-h-70 overflow-x-auto shadow-md sm:rounded-lg">
        {!isArray && renderGroupedTable()}
        {isArray && renderTable()}
      </div>
    </Modal>
  );
};

export default ModalPreview;
