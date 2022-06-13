/**
 * More info at: https://en.wikipedia.org/wiki/Order_statistic
 */

// O(n) search to find the max of an array
export const min = <T>(array: T[], cmp: (a: T, b: T) => number) => {
  let best = 0

  for (let curr = 1; curr < array.length; curr++) {
    if (cmp(array[best], array[curr]) > 0) {
      best = curr
    }
  }

  return array[best]
}
