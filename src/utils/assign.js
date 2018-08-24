export default function assign() {
  for (let i = 1; i < arguments.length; i++) {
    Object.keys(arguments[i]).forEach(key => {
      arguments[0][key] = arguments[i][key];
    });
  }
  return arguments[0];
}
