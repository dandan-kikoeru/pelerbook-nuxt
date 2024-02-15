export default (input: string) => {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = input
  return textarea.value
}
