export function CopyKeysToVals(list) {
  let res = {};
  list.forEach(key => {
    res[key] = key;
  });
  return res;
}

