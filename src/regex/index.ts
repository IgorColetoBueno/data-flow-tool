export const US_DATE_FORMAT =
  /\b(0?[1-9]|1[012])([\/\-])(0?[1-9]|[12]\d|3[01])\2(\d{4})/g;

export const BR_DATE_FORMAT =
  /\b(0?[1-9]|[12]\d|3[01])([\/\-])(0?[1-9]|1[012])\2(\d{4})/g;

export const ISO_DATE_FORMAT =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)$/g;

export const isJSONDate = (value: any): boolean => {
  if (typeof value !== "string") return false;

  return new Date(value).toString() !== "Invalid Date";
};
