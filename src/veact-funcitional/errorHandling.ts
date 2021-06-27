import { isFunction, isPromise } from '@vue/shared';
import { CompositionContext } from './context';

export function callWithErrorHandling(
  fn: Function,
  instance: CompositionContext | void,
  type: string,
  args?: unknown[]
) {
  let res;
  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
  return res;
}

export function callWithAsyncErrorHandling(
  fn: Function | Function[],
  instance: CompositionContext | void,
  type: string,
  args?: unknown[]
): any[] {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }

  const values = [];
  for (let i = 0; i < fn.length; i++)
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));

  return values;
}

export function handleError(
  err: unknown,
  instance: CompositionContext | void,
  type: String
) {
  console.error(new Error(`[reactivue:${instance}]: ${type}`));
  console.error(err);
}

export function raise(message: string): never {
  throw createError(message);
}

export function warn(message: string) {
  console.warn(createError(message));
}

export function createError(message: string) {
  return new Error(`[reactivue]: ${message}`);
}
