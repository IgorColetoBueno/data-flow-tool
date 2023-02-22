const STORE_NAME = "data_from_editor";

export class DatabaseManager {
  private static readonly databaseName: string = "DFT_DB";

  private static openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      var connection: IDBOpenDBRequest;
      connection = window.indexedDB.open(this.databaseName, 1);
      connection.onupgradeneeded = function () {
        var db = connection.result;

        // Creating DDL
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, {
            autoIncrement: true,
          });
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

  public static async save(obj: any[]) {
    return new Promise<void>(async (resolve, reject) => {
      let db = await this.openDatabase();

      let transaction: IDBTransaction = db.transaction(STORE_NAME, "readwrite");

      var store = transaction.objectStore(STORE_NAME);

      //Set data into database
      obj.forEach((item) => store.put(item));

      transaction.oncomplete = function () {
        resolve();
        db.close();
      };

      transaction.onerror = () => {
        reject();
      };
    });
  }

  public static async getAll() {
    return new Promise<any[]>(async (resolve, reject) => {
      let db = await this.openDatabase();

      var results: Array<any> = [];
      let transaction: IDBTransaction = db.transaction(STORE_NAME, "readonly");
      var store = transaction.objectStore(STORE_NAME);

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

  public static async getLimitedItems(numberOfItems: number) {
    return new Promise<any[]>(async (resolve, reject) => {
      let db = await this.openDatabase();

      var results: Array<any> = [];
      let transaction: IDBTransaction = db.transaction(STORE_NAME, "readonly");
      var store = transaction.objectStore(STORE_NAME);

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

  public static async getCount(searchIndex: string) {
    return new Promise<number>(async (resolve, reject) => {
      let db = await this.openDatabase();

      let transaction: IDBTransaction = db.transaction(STORE_NAME, "readonly");
      var store = transaction.objectStore(STORE_NAME);

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

  public static async getAllByIndex(search: ISearchByIndex) {
    return new Promise<any[]>(async (resolve, reject) => {
      let db = await this.openDatabase();

      var results: Array<any> = [];
      let transaction: IDBTransaction = db.transaction(STORE_NAME, "readonly");
      var store = transaction.objectStore(STORE_NAME);
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

  public static async getOne(key: string) {
    return new Promise(async (resolve, reject) => {
      let db = await this.openDatabase();
      let transaction: IDBTransaction = db.transaction(STORE_NAME, "readonly");
      var store = transaction.objectStore(STORE_NAME);
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

  public static async remove(key: string) {
    return new Promise<void>(async (resolve, reject) => {
      let db = await this.openDatabase();

      let transaction: IDBTransaction = db.transaction(STORE_NAME, "readwrite");
      var store = transaction.objectStore(STORE_NAME);
      store.delete(key);

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
  public static async clearAll(items?: string[]) {
    return new Promise<void>(async (resolve, reject) => {
      let db = await this.openDatabase();

      let transaction: IDBTransaction = db.transaction(STORE_NAME, "readwrite");
      var store = transaction.objectStore(STORE_NAME);

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

  public static async removeDatabase() {
    return new Promise<void>(async (resolve, reject) => {
      let req = window.indexedDB.deleteDatabase(this.databaseName);

      req.onsuccess = function () {
        resolve();
      };

      req.onerror = function () {
        reject();
      };
    });
  }
}

interface ISearchByIndex {
  index: string;
  value: any;
}
