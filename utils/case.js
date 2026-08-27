function toCamelKey(key) {
  return key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}

function toSnakeKey(key) {
  return key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
}

function transformKeys(value, transformKey) {
  if (Array.isArray(value)) {
    return value.map((item) => transformKeys(item, transformKey));
  }
  if (value !== null && typeof value === "object" && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [
        transformKey(key),
        transformKeys(nested, transformKey),
      ])
    );
  }
  return value;
}

export function keysToCamel(value) {
  return transformKeys(value, toCamelKey);
}

export function keysToSnake(value) {
  return transformKeys(value, toSnakeKey);
}
