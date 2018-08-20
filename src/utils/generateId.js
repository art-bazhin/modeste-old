const MAX_VALUE = 1000000000000;

export default function generateId(store, middleware) {
  let value, id;

  do {
    value = value
      ? value + Math.floor(Math.random() * 35).toFixed(36)
      : Math.floor(Math.random() * MAX_VALUE).toString(36);

    id = value;
    if (middleware) id = middleware(value);
  } while (store[id]);

  store[id] = true;

  return id;
}
