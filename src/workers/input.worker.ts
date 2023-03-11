import { BR_DATE_FORMAT, US_DATE_FORMAT } from "@/regex";
import { EXTERNAL_KEY_BOARD_FROM_EDITOR } from "@/storage";
import { DataDbHandler } from "@/storage/dataDbHandler";
import { parse } from "date-fns";

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
    if (!!data.key) {
      await DataDbHandler.removeByIndex(
        { index: EXTERNAL_KEY_BOARD_FROM_EDITOR, value: data.key },
        indexedDB
      );
    }

    const keys = Object.keys(obj[0]);
    obj.forEach((item) => {
      item[EXTERNAL_KEY_BOARD_FROM_EDITOR] = data.key;

      keys.map((key) => {
        if (typeof item[key] !== "string") {
          return;
        }

        if (US_DATE_FORMAT.test(item[key])) {
          item[key] = parse(item[key], "MM/dd/yyyy", new Date());
        }

        if (BR_DATE_FORMAT.test(item[key])) {
          item[key] = parse(item[key], "dd/MM/yyyy", new Date());
        }
      });
    });

    await DataDbHandler.save(obj, indexedDB);
    postMessage({
      type: "finished",
      payload: obj.slice(0, 29),
      fileName: data.file.name,
    } as IDataWorkerMessage);
  } catch (error) {
    postMessage({ type: "error" } as IDataWorkerMessage);
  }
};
