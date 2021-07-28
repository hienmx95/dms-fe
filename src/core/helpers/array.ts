import { Model } from 'core/models';

export function swapPosition(arr: any[], from: number, to: number) {
  [arr[from], arr[to]] = [arr[to], arr[from]];
  return arr;
}

export const flattenData = <T extends Model, T2 extends Model>(list: T[], field: string): T2[] => {
  const result = [];
  if(list.length > 0){
    list.forEach((item) => {
      if(item[field]?.length > 0){
        item[field].forEach((i) => {
          result.push({...item, ...i} as T2);
        });
      }
    });
  }
  return result;
}; // use to flatten nested data from report and monitor
