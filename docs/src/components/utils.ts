export function shuffle<X extends Array<any>>(array: X): X {
  let currentIndex = array.length;
  let temporaryValue = null;
  let randomIndex = 0;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export function inDevelopment(): boolean {
  return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
}

export function onServer(): boolean {
  return (
    typeof window === 'undefined' ||
    typeof window.document === 'undefined' ||
    typeof window.document.createElement === 'undefined'
  );
}
