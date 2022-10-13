function ArrayChallenge(arr) {
  let longest = 0
  let max = 0
  for (i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
      longest++
      max = arr[i]
    }
  }

  return longest == 0 ? 1 : longest;
}


function first4(arr) {
  arr.sort()
  let sum = arr.slice(arr.length - 4, arr.length).reduce((acc, x) => {
    return acc + x
  })

  return sum.toString() + "hotx8_blablabla"
}

console.log(first4([4, 5, -2, 3, 1, 2, 6, 6]))
a = "abundance"
a[0] = "1"
console.log(a)
