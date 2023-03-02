import { EXTERNAL_KEY_BOARD_FROM_EDITOR } from "@/storage";
import { DataDbHandler } from "@/storage/dataDbHandler";

export interface IDataWorkerMessage {
  type: string;
  fileName: string;
  payload: any[];
}

export interface IWorkerData {
  file: File;
  key: string;
}

onmessage = async ({ data }: MessageEvent<IWorkerData>): Promise<void> => {
  const strJSON = await data.file.text();
  const obj: any[] = JSON.parse(strJSON);

  if (!obj.length) return;

  try {
    debugger;
    await DataDbHandler.removeByIndex(
      { index: EXTERNAL_KEY_BOARD_FROM_EDITOR, value: data.key },
      indexedDB
    );
    await DataDbHandler.save(
      obj.map((obj) => ({
        ...obj,
        [EXTERNAL_KEY_BOARD_FROM_EDITOR]: data.key,
      })),
      indexedDB
    );
    postMessage({
      type: "finished",
      payload: obj.slice(0, 29),
      fileName: data.file.name,
    } as IDataWorkerMessage);
  } catch (error) {
    postMessage({ type: "error" } as IDataWorkerMessage);
  }
};
