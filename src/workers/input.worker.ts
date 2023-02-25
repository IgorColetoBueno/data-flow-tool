import { DatabaseManager } from "@/storage/indexedDbHandler";

export interface IDataWorkerMessage {
  type: string;
  fileName: string;
  payload: any[];
}

export interface IWorkerData {
  file: File;
}

onmessage = async ({ data }: MessageEvent<IWorkerData>): Promise<void> => {
  const strJSON = await data.file.text();
  const obj: any[] = JSON.parse(strJSON);

  if (!obj.length) return;

  try {
    await DatabaseManager.removeDatabase(indexedDB);
    await DatabaseManager.save(obj, indexedDB);
    postMessage({
      type: "finished",
      payload: obj.slice(0, 29),
      fileName: data.file.name,
    } as IDataWorkerMessage);
  } catch (error) {
    postMessage({ type: "error" } as IDataWorkerMessage);
  }
};
