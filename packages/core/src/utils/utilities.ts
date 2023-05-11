//Input "Example Text!". Output: example-text
export function textToKebabCase(text: string): string {
  // Replace spaces and special characters with hyphens
  let kebabCase = text.replace(/[^\w\s]/gi, '-')

  // Remove whitespace
  kebabCase = kebabCase.replace(/\s+/g, '-')

  // Convert to lowercase
  kebabCase = kebabCase.toLowerCase()

  return kebabCase ?? ''
}
