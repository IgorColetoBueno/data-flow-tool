import { IDataStateNodeSort } from "@/store/dataSlice";

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

  static group(arr: any[], fields: string[], sort: IDataStateNodeSort[]) {
    const groupedData = arr.reduce(function (groups, item) {
      const val = fields.map((o) => `${o}: ${item[o]}`).join(" - "); //Map and Concat all values of prop and use as key

      groups[val] = groups[val] || [];
      groups[val].push(item);
      return groups;
    }, {});

    const sortFormatted = sort.map((item) =>
      item.desc ? `-${item.name}` : item.name
    );

    Object.keys(groupedData).forEach((key) => {
      groupedData[key] = CollectionHandler.sort(
        groupedData[key],
        sortFormatted
      );
    });

    return groupedData;
  }
}
