const data = [222, 232, 872, 93, 12, 93, 28, 228, 99, 432];
// arranging the data in ascending order
data.sort((a, b) => a - b);
console.log("input data", data);
let min = data.reduce((a, b) => Math.min(a, b));
console.log("min", min);
let max = data.reduce((a, b) => Math.max(a, b));
console.log("max", max);
// now using min and max and give 5 equal intervals between them
let scaledArray = [
  min,
  (max - min) / 4 + min,
  ((max - min) / 4) * 2 + min,
  ((max - min) / 4) * 3 + min,
  max,
];
console.log("evenly scaledArray : \n", scaledArray);
// creating a scale between 0 and 100 where min is 0 and max is 100
const scaledArray2 = data.map((item) => {
  return parseInt((item / max) * 100);
});
console.log("scaled between 0-100 : \n", scaledArray2);
