export function logged(orig: any, context: ClassMethodDecoratorContext) {
  const methodName = String(context.name);

  function wrapper(this: any, ...args: any[]) {
    console.log(`Entering method '${methodName}'.`);
    const result = orig.call(this, ...args);
    return result;
  }

  return wrapper;
}

export function arrayContentEquals<T>(a: T[], b: T[]) {
  if (a.length !== b.length) return false;
  const aa = a.slice();
  const bb = b.slice();
  for (let i = 0; i < aa.length; i++) {
    if (aa[i] !== bb[i]) return false;
  }
  return true;
}

export function arrayEquals<T>(a: T[], b: T[]) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export const loerm = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`;
