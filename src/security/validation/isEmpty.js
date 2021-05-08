export default function isEmpty(obj) {
  if (obj !== undefined && obj !== null) {
    let isString = typeof obj === 'string' || obj instanceof String;
    if ((typeof obj === 'number' || obj instanceof Number) && obj !== 0) {
      return false;
    }
    return obj === '' || obj === 0 || Object.keys(obj).length === 0 && obj.constructor === Object || obj.length === 0 || isString && obj.trim().length === 0;
  } else {
    return 'type is undefined or null';
  }
}
