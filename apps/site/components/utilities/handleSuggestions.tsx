function formatSearchTerm(
  indexSubstring: number,
  searchTerm: string,
  suggestion: string
) {
  if (indexSubstring === 0) {
    return searchTerm
      .split('')
      .map((char, idx) =>
        idx === 0 && suggestion.indexOf(char.toUpperCase()) === 0
          ? char.toUpperCase()
          : char.toLowerCase()
      )
      .join('')
  }

  return searchTerm.toLowerCase()
}

export function handleSuggestions(suggestion: string, searchTerm: string) {
  const suggestionSubstring = suggestion
    .toLowerCase()
    .split(searchTerm.toLowerCase())

  return (
    <p>
      {suggestionSubstring.map((substring, indexSubstring) => (
        <>
          {substring.length > 0 && (
            <strong
              key={[substring, indexSubstring].join()}
              data-fs-search-auto-complete-item-suggestion
            >
              {indexSubstring === 0
                ? substring.charAt(0).toUpperCase() + substring.slice(1)
                : substring}
            </strong>
          )}
          {indexSubstring !== suggestionSubstring.length - 1 &&
            formatSearchTerm(indexSubstring, searchTerm, suggestion)}
        </>
      ))}
    </p>
  )
}
