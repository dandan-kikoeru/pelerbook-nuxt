export default (input: string): string => {
  return input
    .replace(/\n/g, '<br>')
    .replace(/\*(.*?)\*/g, '<b>$1</b>')
    .replace(/\_(.*?)\_/g, '<i>$1</i>')
    .replace(/\~(.*?)\~/g, '<strike>$1</strike>')
    .replace(/\`\`\`(.*?)\`\`\`/g, '<code>$1</code>')
    .replace(
      /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/#=]*)/g,
      '<a class="text-primary hover:underline" href="$&" target="_blank">$&</a>',
    )
    .replace(/(\\u[0-9A-Fa-f]{4}|\\U[0-9A-Fa-f]{8})/g, function (match) {
      let code = match.replace(/\\u|\\U/, '')
      return String.fromCodePoint(parseInt(code, 16))
    })
}
