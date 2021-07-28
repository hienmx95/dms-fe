import path from 'path';
import queryString from 'query-string';
import { flatten } from 'core/helpers/json';

export function url(baseURL: string, ...segments: string[]) {
  return `${baseURL}/${path.join(...segments)}`;
}

export function buildLink(route: string, id: number) {
  return `${route}#${id}`;
}

export function limitWord(input: string, max: number) {
  if (input?.length > max) {
    input = input.slice(0, max);
    const output: string = input + '...';
    return output;
  }
  return input;
}

export function sliceText(text: string) {
  if (text.length > 50) {
    return text.slice(0, 50) + '...';
  }
  return text;
}

export function buildAbsoluteLink(url: string | null | undefined | number) {
  if (url === null || typeof url === 'undefined') {
    return '#';
  }
  return path.join('/', url.toString());
}

export function buildLinkWithSearch(baseUrl: string, filter: any) {
  return `${baseUrl}?${queryString.stringify(flatten(filter))}`;
}
