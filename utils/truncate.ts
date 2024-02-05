export default (input: string | undefined, maxLength: number) => {
  if (input !== undefined) {
    const textWithoutTags = input.replace(/<\/?[^>]+(>|$)/g, '')
    const truncatedText = textWithoutTags
      .slice(0, maxLength)
      .replace(/\s+\S*$/, '')
    if (textWithoutTags.length > truncatedText.length) {
      return truncatedText + '...'
    }
    return truncatedText
  }
}
