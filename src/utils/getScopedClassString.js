const REGEX = /(\s__)|(\s_)/gm;

export default function getScopedClassString(str, prefix) {
  str = ' ' + str;
  return str
    .replace(REGEX, (match, p1, p2) => {
      if (p1) return ' _';
      return ' ' + prefix;
    })
    .substr(1);
}
