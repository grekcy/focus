export function logged(orig: any, context: ClassMethodDecoratorContext) {
  const methodName = String(context.name);

  function wrapper(this: any, ...args: any[]) {
    console.log(`Entering method '${methodName}'.`);
    const result = orig.call(this, ...args);
    return result;
  }

  return wrapper;
}
