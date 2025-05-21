export default function pathCombine(...args) {
  let parts: string[] = [];
  const argsAsArray = Array.from(Array.isArray(args[0]) ? args[0] : args);
  argsAsArray.forEach(a => parts = parts.concat(a.split('/')));

  let r: string[] = [];
  parts.forEach(p => {
    if (p == '' || p == '/' || p == '.') return;
    if (p == '..') r.pop();
    else r.push(p);
  });
  
  return r.join('/');
}