export const DATA_FROM_STORE_NAME = "data_from_editor";
export const BOARD_FROM_EDITOR_STORE_NAME = "board_from_editor";
export const EXTERNAL_KEY_BOARD_FROM_EDITOR = "board_from_editor_id";

export class BaseConnection {
  private static readonly databaseName: string = "DFT_DB";

  public static get(indexedDB: IDBFactory): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      var connection: IDBOpenDBRequest;

      connection = indexedDB.open(this.databaseName, 1);
      connection.onupgradeneeded = function () {
        var db = connection.result;
        if (!db.objectStoreNames.contains(BOARD_FROM_EDITOR_STORE_NAME)) {
          db.createObjectStore(BOARD_FROM_EDITOR_STORE_NAME, {
            autoIncrement: false,
            keyPath: EXTERNAL_KEY_BOARD_FROM_EDITOR,
          });
        }
        // Creating DDL
        if (!db.objectStoreNames.contains(DATA_FROM_STORE_NAME)) {
          const store = db.createObjectStore(DATA_FROM_STORE_NAME, {
            autoIncrement: true,
          });

          store.createIndex(
            EXTERNAL_KEY_BOARD_FROM_EDITOR,
            EXTERNAL_KEY_BOARD_FROM_EDITOR
          );
        }
      };

      connection.onsuccess = () => {
        resolve(connection.result);
      };

      connection.onerror = () => {
        reject(new Error("Connection failed"));
      };
    });
  }

  public static async removeDb(indexedDB: IDBFactory) {
    return new Promise<void>(async (resolve, reject) => {
      let req = indexedDB.deleteDatabase(this.databaseName);

      req.onsuccess = function () {
        resolve();
      };

      req.onerror = function () {
        reject();
      };
    });
  }
}
