// @ts-check

export function humanize(n, options) {
  options = options || {}
  let d = options.delimiter || ','
  let s = options.separator || '.'
  n = n.toString().split('.')
  n[0] = n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + d)
  return n.join(s)
}

/**
 * @param {Date} start
 * @param {Date} end
 * @returns
 */
export function time(start, end) {
  const delta = end.getTime() - start.getTime()

  return humanize(delta < 10000 ? delta + 'ms' : Math.round(delta / 1000) + 's')
}
