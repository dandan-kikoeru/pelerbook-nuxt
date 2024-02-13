export default (input: string, maxLength: number = 63): string => {
  const textWithoutTags = input.replace(/<\/?[^>]+(>|$)/g, '')
  const truncatedText = textWithoutTags.slice(0, maxLength)
  return textWithoutTags.length > truncatedText.length
    ? truncatedText.replace(/\s+\S*$/, '...')
    : truncatedText
}
