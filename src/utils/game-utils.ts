import {Point} from "../common/models.ts";
import {Cell} from "../classes/battlefield/Battlefield.ts";

export function getRandomBetween(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function getRandomFrom(...args: string[]) {
  const index = Math.floor(Math.random() * args.length);
  return args[index];
}

export function isUnderPoint(point: Point, element: HTMLElement | null) {
  const {left, top, width, height} = element!.getBoundingClientRect();
  const {x, y} = point;

  return left <= x && x <= left + width && top <= y && y <= top + height;
}

export function addListener(element: Element, listener: () => void ): () => void {
  element?.addEventListener('click', listener);
  return () => element?.removeEventListener('click', listener);
}
export function getRandomSeveral(array = [] as Cell[], size: number) {
  array = array.slice();

  if (size > array.length) {
    size = array.length;
  }

  const result = [] as Cell[];
  
  while (result.length < size) {
    const index= Math.floor(Math.random() * array.length);
    const item = array.splice(index, 1)[0];
    result.push(item);
  }

  return result;
}