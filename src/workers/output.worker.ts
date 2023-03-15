import { EXTERNAL_KEY_BOARD_FROM_EDITOR } from "@/storage";
import { DataDbHandler } from "@/storage/dataDbHandler";
import { IDataStateNode } from "@/store/dataSlice";
import { CollectionHandler } from "@/util/collectionHandler";

export interface IOutputWorkerMessage {
  type: string;
  payload: any[];
}

export interface IOutputWorkerData {
  dataStateNode: IDataStateNode;
  id: string;
}

onmessage = async ({
  data,
}: MessageEvent<IOutputWorkerData>): Promise<void> => {
  try {
    let items = await DataDbHandler.getAllByIndex(
      { index: EXTERNAL_KEY_BOARD_FROM_EDITOR, value: data.id },
      indexedDB
    );

    const columnsToRemove = data.dataStateNode.columns
      .filter((q) => !q.checked)
      .map((item) => item.originalName);
    const fields = data.dataStateNode.sort.map((col) =>
      col.desc ? `-${col.name}` : col.name
    );

    if (data.dataStateNode.columns.some((q) => !q.checked)) {
      items = CollectionHandler.removeColumns(items, columnsToRemove);
    }

    if (!!data.dataStateNode.group.length) {
      items = CollectionHandler.group(
        items,
        data.dataStateNode.group,
        data.dataStateNode.sort
      );
    } else {
      if (!!data.dataStateNode.sort.length) {
        items = CollectionHandler.sort(items, fields);
      }
    }
    postMessage({
      type: "finished",
      payload: items,
    } as IOutputWorkerMessage);
  } catch (error) {
    postMessage({ type: "error" } as IOutputWorkerMessage);
  }
};
