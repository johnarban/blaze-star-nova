// debounce.ts

// from https://kettanaito.com/blog/debounce-vs-throttle#:~:text=Implementing%20throttle,1
export function throttle(func, duration) {
  let shouldWait = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (this: any, ...args: any[]) {
    if (!shouldWait) {
      func.apply(this, args);
      shouldWait = true;
  
      setTimeout(function () {
        shouldWait = false;
      }, duration);
    }
  };
}
