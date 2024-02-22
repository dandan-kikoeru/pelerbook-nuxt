export default (input: string): string => {
  return input
    .replace(/\ssecond(s)? ago/g, `s`)
    .replace(/\sminute(s)? ago/g, `m`)
    .replace(/\shour(s)? ago/g, `h`)
    .replace(/\sday(s)? ago/g, `d`)
    .replace(/yesterday/g, `1d`)
    .replace(/\sweek(s)? ago/g, `w`)
    .replace(/last week/g, `1w`)
    .replace(/\smonth(s)? ago/g, `mo`)
    .replace(/last month/g, `1mo`)
    .replace(/\syear(s)? ago/g, `y`)
    .replace(/last year/g, `1y`)
}
