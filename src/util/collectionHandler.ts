export class CollectionHandler {
  static removeColumns(collection: any[], columnsToRemove: string[]) {
    return collection.map((item) => {
      const clonedItem = structuredClone(item);

      columnsToRemove.forEach((col) => Reflect.deleteProperty(clonedItem, col));

      return clonedItem;
    });
  }
  static sort(collection: any[], fields: string[]) {
    const newColletion = structuredClone(collection);

    return newColletion.sort((a: any, b: any) => {
      const mapped = fields.map((o: any) => {
        let dir = 1;
        if (o[0] === "-") {
          dir = -1;
          o = o.substring(1);
        }
        return a[o] > b[o] ? dir : a[o] < b[o] ? -dir : 0;
      });

      const order = mapped.reduce((p: any, n: any) => (p ? p : n), 0);
      return order;
    });
  }
}
