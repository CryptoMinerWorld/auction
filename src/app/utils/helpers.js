export const OxToLowerCase = id => id
  .split('')
  .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
  .join('');

export const TEMP = id => id
  .split('')
  .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
  .join('');
