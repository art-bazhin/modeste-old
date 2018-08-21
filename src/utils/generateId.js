const ID_RND_LENGTH = 6;
let idCounter = 0;

export default function generateId(middleware) {
  let random = Math.random()
    .toString(36)
    .substr(2, ID_RND_LENGTH);

  let id =
    random +
    '0'.repeat(ID_RND_LENGTH - random.length) +
    (idCounter++).toString(36);

  if (middleware) return middleware(id);
  return id;
}
