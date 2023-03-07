import { BaseConnection, DATA_FROM_STORE_NAME } from ".";

export class DataDbHandler {
  public static async save(obj: any | any[], indexedDB: IDBFactory) {
    return new Promise<void>(async (resolve, reject) => {
      let db = await BaseConnection.get(indexedDB);

      let transaction: IDBTransaction = db.transaction(
        DATA_FROM_STORE_NAME,
        "readwrite"
      );

      var store = transaction.objectStore(DATA_FROM_STORE_NAME);

      //Set data into database
      if (Array.isArray(obj)) {
        obj.forEach((item) => store.put(item));
      } else {
        store.put(obj);
      }

      transaction.oncomplete = function () {
        resolve();
        db.close();
      };

      transaction.onerror = () => {
        reject();
      };
    });
  }

  public static async getAll(indexedDB: IDBFactory) {
    return new Promise<any[]>(async (resolve, reject) => {
      let db = await BaseConnection.get(indexedDB);

      var results: Array<any> = [];
      let transaction: IDBTransaction = db.transaction(
        DATA_FROM_STORE_NAME,
        "readonly"
      );
      var store = transaction.objectStore(DATA_FROM_STORE_NAME);

      var cursor = store.openCursor() as IDBRequest;

      cursor.onsuccess = (ev: any) => {
        var response: IDBCursorWithValue = ev.target.result;
        if (response) {
          results.push(response.value as any);
          response.continue();
        }
      };

      transaction.oncomplete = function () {
        resolve(results);
        db.close();
      };

      transaction.onerror = () => {
        reject("Failed to search");
        db.close();
      };
    });
  }

  public static async getLimitedItems(
    numberOfItems: number,
    indexedDB: IDBFactory
  ) {
    return new Promise<any[]>(async (resolve, reject) => {
      let db = await BaseConnection.get(indexedDB);

      var results: Array<any> = [];
      let transaction: IDBTransaction = db.transaction(
        DATA_FROM_STORE_NAME,
        "readonly"
      );
      var store = transaction.objectStore(DATA_FROM_STORE_NAME);

      var cursor = store.openCursor() as IDBRequest;

      cursor.onsuccess = (ev: any) => {
        var response: IDBCursorWithValue = ev.target.result;

        if (results.length === numberOfItems) {
          resolve(results);
          return;
        }

        if (response) {
          results.push(response.value as any);
          response.continue();
        }
      };

      transaction.oncomplete = function () {
        resolve(results);
        db.close();
      };

      transaction.onerror = () => {
        reject("Failed to search");
        db.close();
      };
    });
  }

  public static async getCount(searchIndex: string, indexedDB: IDBFactory) {
    return new Promise<number>(async (resolve, reject) => {
      let db = await BaseConnection.get(indexedDB);

      let transaction: IDBTransaction = db.transaction(
        DATA_FROM_STORE_NAME,
        "readonly"
      );
      var store = transaction.objectStore(DATA_FROM_STORE_NAME);

      var index = store.index(searchIndex);
      var countRequest = index.count();

      countRequest.onsuccess = () => {
        resolve(countRequest.result);
      };

      countRequest.onerror = () => {
        reject("Failed to get count");
      };
    });
  }

  public static async removeByIndex(
    search: ISearchByIndex,
    indexedDB: IDBFactory
  ) {
    return new Promise<void>(async (resolve, reject) => {
      let db = await BaseConnection.get(indexedDB);

      let transaction: IDBTransaction = db.transaction(
        DATA_FROM_STORE_NAME,
        "readwrite"
      );
      debugger;
      var store = transaction.objectStore(DATA_FROM_STORE_NAME);
      var index = store.index(String(search.index));
      var request = index.openCursor(IDBKeyRange.only(search.value));

      request.onsuccess = () => {
        var cursor: IDBCursorWithValue | null = request.result;
        debugger;
        if (cursor) {
          store.delete(cursor.primaryKey);
          cursor.continue();
        }
      };

      transaction.oncomplete = () => {
        resolve();
        db.close();
      };

      transaction.onerror = () => {
        reject("Não foi possível obter os dados");
        db.close();
      };
    });
  }

  public static async getAllByIndex(
    search: ISearchByIndex,
    indexedDB: IDBFactory
  ) {
    return new Promise<any[]>(async (resolve, reject) => {
      let db = await BaseConnection.get(indexedDB);

      var results: Array<any> = [];
      let transaction: IDBTransaction = db.transaction(
        DATA_FROM_STORE_NAME,
        "readonly"
      );
      var store = transaction.objectStore(DATA_FROM_STORE_NAME);
      var index = store.index(String(search.index));
      var request = index.openCursor(IDBKeyRange.only(search.value));

      request.onsuccess = () => {
        var cursor: IDBCursorWithValue | null = request.result;
        if (cursor) {
          results.push(cursor.value as any);
          cursor.continue();
        }
      };

      transaction.oncomplete = () => {
        resolve(results);
        db.close();
      };

      transaction.onerror = () => {
        reject("Não foi possível obter os dados");
        db.close();
      };
    });
  }

  public static async getOne(key: string, indexedDB: IDBFactory) {
    return new Promise(async (resolve, reject) => {
      let db = await BaseConnection.get(indexedDB);
      let transaction: IDBTransaction = db.transaction(
        DATA_FROM_STORE_NAME,
        "readonly"
      );
      var store = transaction.objectStore(DATA_FROM_STORE_NAME);
      //Pega cursores do banco de dados
      var request = store.get(key) as IDBRequest;
      request.onsuccess = () => {
        var value = request.result;
        if (value) {
          resolve(value);
        }
      };

      transaction.oncomplete = function () {
        db.close();
      };

      transaction.onerror = () => {
        reject("Não foi possível obter o dado");
      };
    });
  }

  public static async remove(key: string | string[], indexedDB: IDBFactory) {
    return new Promise<void>(async (resolve, reject) => {
      let db = await BaseConnection.get(indexedDB);

      let transaction: IDBTransaction = db.transaction(
        DATA_FROM_STORE_NAME,
        "readwrite"
      );
      var store = transaction.objectStore(DATA_FROM_STORE_NAME);

      if (Array.isArray(key)) {
        key.map((item) => store.delete(item));
      } else {
        store.delete(key);
      }

      transaction.oncomplete = function () {
        db.close();
        resolve();
      };

      transaction.onerror = function () {
        reject("Não foi possível remover!");
      };
    });
  }

  /**
   * Deletes specific items from store. If items does not exist clear all data from store
   * @param items specific items to delete
   * @returns A empty promise
   */
  public static async clearAll(indexedDB: IDBFactory, items?: string[]) {
    return new Promise<void>(async (resolve, reject) => {
      let db = await BaseConnection.get(indexedDB);

      let transaction: IDBTransaction = db.transaction(
        DATA_FROM_STORE_NAME,
        "readwrite"
      );
      var store = transaction.objectStore(DATA_FROM_STORE_NAME);

      if (items) {
        items.forEach((item) => store.delete(item));
      } else {
        store.clear();
      }

      transaction.oncomplete = function () {
        resolve();
      };

      transaction.onerror = function () {
        reject();
      };
    });
  }

  public static async removeDatabase(indexedDB: IDBFactory) {
    return await BaseConnection.removeDb(indexedDB);
  }
}

interface ISearchByIndex {
  index: string;
  value: any;
}
