import loadData from '../loading.ts'; // Importing a function to load data from a file

// Load the input data from the specified file
const data = await loadData('./input.txt');

// Process the data to separate it into two lists: 'left' and 'right'
// Each line of input is split into two parts by a separator (three spaces in this case)
const lists = data.reduce((prev, curr) => {
    const [left, right] = curr.split('   '); // Split each line into 'left' and 'right' parts
    prev.left.push(Number(left.trim())) // Convert the left part to a number and add to the 'left' list
    prev.right.push(Number(right.trim())) // Convert the right part to a number and add to the 'right' list
    return prev;
}, {
    left: [], // Initialize an empty array for 'left' numbers
    right: [] // Initialize an empty array for 'right' numbers
});

// Sort both 'left' and 'right' lists in ascending order
lists.left.sort((a, b) => a - b);
lists.right.sort((a, b) => a - b);

// Calculate the absolute differences between corresponding elements of 'left' and 'right' lists
const diffs = [];
for (let index = 0; index < lists.left.length; index++) {
    diffs.push(Math.abs(lists.left[index] - lists.right[index])); // Compute absolute difference
}
console.log(lists); // Log the sorted 'left' and 'right' lists for verification

console.log(diffs); // Log the array of differences

// Calculate the total of all differences
const total = diffs.reduce((prev, curr) => {
    return prev + curr; // Sum up the differences
}, 0);

console.log(total); // Log the total of differences

// Calculate similarity scores based on occurrences of numbers in the 'right' list
const simScores = [];
lists.left.forEach((leftNumber) => {
    const occurances = lists.right.filter((item) => item === leftNumber); // Find occurrences of the current number in the 'right' list
    simScores.push(occurances.length * leftNumber); // Compute the similarity score as (count * number)
});

// Sum up all similarity scores to get the total similarity score
const simScoreTotal = simScores.reduce((prev, curr) => {
    return prev + curr; // Sum up similarity scores
}, 0);

console.log(simScoreTotal); // Log the total similarity score
