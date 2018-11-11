export function getAfterDot(value: number) {
    const str = value.toString();
    const i = str.indexOf('.');
    if (i === -1) { return ''; }
    return str.substr(i).replace('.', ',');
  }

export function getThousundDot(value: number) {
  const u = Math.floor(value).toString();
  let n = '';
  for (let c = 0, i = u.length - 1; i >= 0; i--, c++) {
    if ((c % 3) === 0 && c > 0) {
      n = '.' + n;
    }

    n = u[i] + n;
  }
  return n;
}
