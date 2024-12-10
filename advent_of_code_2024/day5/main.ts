import loadData from '../loading.ts'; 

const data = await loadData('./input.txt');

const splitIndex = data.findIndex((row) => !row.includes('|'))

interface Rule {
    before: number,
    after: number
}

const orderingRules: Rule[] = data.slice(0, splitIndex).map(row => {
    const [before, after] = row.split('|').map(Number)
    return {before, after}
})

const updates: number[][] = data.slice(splitIndex).map(row => row.split(',').map(Number))

const correctUpdates = []
const incorrectUpdates = []
for (const update of updates) {
    const aplicableRules = orderingRules.filter((rule) => update.includes(rule.before) && update.includes(rule.after))
    let rulesPassed = 0;
    for (const rule of aplicableRules) {
        if (update.findIndex((page) => page === rule.before) < update.findIndex((page) => page === rule.after)) {
            rulesPassed++;
        }
    }
    if (rulesPassed === aplicableRules.length) {
        correctUpdates.push(update)
    } else {
        incorrectUpdates.push(update)
    }
}

const score = correctUpdates.reduce((prev, curr) => {
    const index = Math.floor(curr.length / 2)
    return prev + curr[index]
}, 0)

console.log(score);

const checkRule = (rule, update) => {
    return update.findIndex(page => page === rule.before) < update.findIndex(page => page === rule.after)
}

for (const update of incorrectUpdates) {
    const aplicableRules = orderingRules.filter((rule) => update.includes(rule.before) && update.includes(rule.after))
    while (aplicableRules.some(
        rule => !checkRule(rule, update))
    ) {
        const rule = aplicableRules.find(rule => !checkRule(rule, update))
        const beforeIndex = update.findIndex(page => page === rule.before)
        const afterIndex =  update.findIndex(page => page === rule.after)
        update[beforeIndex] = rule.after
        update[afterIndex] = rule.before
    }
}

const newScore = incorrectUpdates.reduce((prev, curr) => {
    const index = Math.floor(curr.length / 2)
    return prev + curr[index]
}, 0)

console.log(newScore);
