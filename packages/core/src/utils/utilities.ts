// Input "Example Text!". Output: example-text
export function textToKebabCase(text: string): string {
  // Replace spaces and special characters with hyphens
  let kebabCase = text.replace(/[^\w\s]/gi, '-')

  // Remove whitespace
  kebabCase = kebabCase.replace(/\s+/g, '-')

  // Convert to lowercase
  kebabCase = kebabCase.toLowerCase()

  return kebabCase ?? ''
}

// Input "EXAMPLE text!". Output: "Example Text!"
export function textToTitleCase(text: string): string {
  return text.replace(
    /\S+/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  )
}
