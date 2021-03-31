const charMap: Record<string, string | undefined> = {
  á: 'a',
  ä: 'a',
  â: 'a',
  à: 'a',
  ã: 'a',
  å: 'a',
  č: 'c',
  ç: 'c',
  ć: 'c',
  ď: 'd',
  é: 'e',
  ě: 'e',
  ë: 'e',
  è: 'e',
  ê: 'e',
  ẽ: 'e',
  ĕ: 'e',
  ȇ: 'e',
  í: 'i',
  ì: 'i',
  î: 'i',
  ï: 'i',
  ň: 'n',
  ñ: 'n',
  ó: 'o',
  ö: 'o',
  ò: 'o',
  ô: 'o',
  õ: 'o',
  ø: 'o',
  ð: 'o',
  ř: 'r',
  ŕ: 'r',
  š: 's',
  ť: 't',
  ú: 'u',
  ů: 'u',
  ü: 'u',
  ù: 'u',
  û: 'u',
  ý: 'y',
  ÿ: 'y',
  ž: 'z',
  þ: 'b',
  Þ: 'B',
  Đ: 'D',
  đ: 'd',
  ß: 'B',
  Æ: 'A',
  a: 'a',
}

export const slugify = (term: string) =>
  term
    // remove case
    .toLowerCase()
    // replace accentuation
    .split('')
    .map((char) => charMap[char] ?? char)
    .join('')
    // remove commas
    .replace(/,/g, '')
    // replace to -
    .replace(/[*+~.()'"!:@&[\]`/ %$#?{}|><=_^·]/g, '-')
