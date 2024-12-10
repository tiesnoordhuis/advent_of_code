import loadData from '../loading.ts'; 

const data = await loadData('./input.txt');

const regex = /mul\(\d{1,3},\d{1,3}\)/g

const matches = [...data.join('').matchAll(regex)].map(match => match[0])

const numberRegex = /(\d{1,3}),(\d{1,3})/g

let total = 0;
for (const match of matches) {
    const [_, left, right] = [...match.matchAll(numberRegex)][0].map(Number)
    total += left * right;
}

console.log(`Total: ${total}`);

const regexDo = /do\(\)/g

const doGroups = data.join('').split(regexDo)

const regexDont = /don't\(\)/g
const doGroupsMinusDont = doGroups.map((group) => group.split(regexDont)[0])

const conditionalMatches = [...doGroupsMinusDont.join('').matchAll(regex)].map(match => match[0])

let totalConditional = 0;
for (const match of conditionalMatches) {
    const [_, left, right] = [...match.matchAll(numberRegex)][0].map(Number)
    totalConditional += left * right;
}

console.log(`Total: ${totalConditional}`);