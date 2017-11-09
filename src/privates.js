module.exports = () => {
  const map = new WeakMap();
  return function p(obj) {
    if (!map.has(obj)) {
      map.set(obj, {});
    }
    return map.get(obj);
  };
};
