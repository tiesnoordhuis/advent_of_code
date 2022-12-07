import { readFile } from 'node:fs/promises';
import path from 'node:path';
class Meal {
    calories;
    constructor(calories) {
        this.calories = calories;
    }
}
class Elf {
    index;
    meals;
    constructor(index, meals) {
        this.index = index;
        this.meals = meals;
    }
    get totalCalories() {
        return this.meals.reduce((acc, meal) => acc + meal.calories, 0);
    }
}
try {
    const importFile = path.join(import.meta.url.slice(5, -8), '/input.txt');
    const elfs = await readFile(importFile, { encoding: 'utf8' })
        .then(loadData);
    let maxCalories = [0, 0, 0];
    for (const elf of elfs) {
        const elfTotalCalories = elf.totalCalories;
        if (elfTotalCalories > maxCalories[0]) {
            maxCalories[2] = maxCalories[1];
            maxCalories[1] = maxCalories[0];
            maxCalories[0] = elfTotalCalories;
        }
        else if (elfTotalCalories > maxCalories[1]) {
            maxCalories[2] = maxCalories[1];
            maxCalories[1] = elfTotalCalories;
        }
        else if (elfTotalCalories > maxCalories[2]) {
            maxCalories[2] = elfTotalCalories;
        }
    }
    console.log(maxCalories[0] + maxCalories[1] + maxCalories[2]);
}
catch (err) {
    console.error(err.message);
}
function loadData(data) {
    const lines = data.split(/(\r\n|\r|\n)/);
    let index = 0;
    let meals = [];
    const elfs = [];
    for (const rawLine of lines) {
        console.log(rawLine);
        if (rawLine.length === 1) {
            continue;
        }
        const line = rawLine.trim();
        if (line.length === 0) {
            elfs.push(new Elf(index++, meals));
            meals = [];
        }
        else {
            meals.push(new Meal(parseInt(line, 10)));
        }
    }
    return elfs;
}
