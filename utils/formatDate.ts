export default (input: string): string => {
  return input
    .replace(/\ssecond(s)? ago/g, `s`)
    .replace(/\sminute(s)? ago/g, `m`)
    .replace(/\shour(s)? ago/g, `h`)
    .replace(/\sday(s)? ago/g, `d`)
    .replace(/\sweek(s)? ago/g, `w`)
    .replace(/\smonth(s)? ago/g, `mo`)
    .replace(/\syear(s)? ago/g, `y`)
}
