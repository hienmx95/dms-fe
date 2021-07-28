export const THOUSAND_SEPARATOR: string = ',';

export const DECIMAL_SEPARATOR: string = '.';

export function formatNumber(x: number | string): string {
  const isNumber: boolean = typeof x === 'number';
  if (isNumber) {
    const parts: string[] = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, THOUSAND_SEPARATOR);
    return parts.join(DECIMAL_SEPARATOR);
  }
  if (x) {
    return x.toString();
  }
  return null;
}

export function parseNumber(formattedNumber: string): number {
  const parts: string[] = formattedNumber.split(DECIMAL_SEPARATOR, 2);
  parts[0] = parts[0].split(THOUSAND_SEPARATOR).join('');
  let result: number;
  if (parts.length === 1) {
    result = parseInt(parts[0], 10);
  } else {
    result = parseFloat(parts.join('.'));
  }
  if (Number.isNaN(result)) {
    return null;
  }
  return result;
}

// export function formatCurrencyUnit(value: number): string {
//   if (value && value > 0 && value < 1000) {
//     return value.toString();
//   }
//   const suffixes = ['', 'K', 'M', 'B', 'T'];
//   const valueString = value?.toString()?.replace('.', '');
//   const suffixNum =
//     valueString.length % 3 === 0
//       ? Math.floor(valueString.length / 3) - 1
//       : Math.floor(valueString.length / 3);
//   let shortValue = parseFloat(
//     (suffixNum !== 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(
//       2,
//     ),
//   );
//   if (shortValue % 1 !== 0) {
//     shortValue = Number(shortValue.toFixed(4));
//   }
//   return shortValue + suffixes[suffixNum];
// }

export function formatCurrencyUnit(x: number) {
  // Nine Zeroes for Billions
  return Math.abs(x) >= 1.0e12
    ? (Math.abs(x) / 1.0e12).toFixed(0) + 'T' // Six Zeroes for Millions
    : Math.abs(x) >= 1.0e9
      ? (Math.abs(x) / 1.0e9).toFixed(0) + 'B'
      : Math.abs(x) >= 1.0e6
        ? (Math.abs(x) / 1.0e6).toFixed(0) + 'M' // Three Zeroes for Thousands
        : Math.abs(x) >= 1.0e3
          ? (Math.abs(x) / 1.0e3).toFixed(0) + 'K'
          : Math.abs(x);
}
