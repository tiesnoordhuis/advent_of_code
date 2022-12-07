import { readFile } from 'node:fs/promises';
import path from 'node:path';

class Meal {
    public calories: number;

    constructor(calories: number) {
        this.calories = calories
    }
}

class Elf {
    public index: number;
    public meals: Meal[];

    constructor(index: number, meals: Meal[]) {
        this.index = index;
        this.meals = meals;
    }
    
    public get totalCalories() : number {
        return this.meals.reduce((acc, meal) => acc + meal.calories, 0);
    }
    
}

try {
    const importFile = path.join(import.meta.url.slice(5, -8), '/input.txt');
    const elfs: Elf[] = await readFile(importFile, { encoding: 'utf8' })
        .then(loadData)
        
    let maxCalories = [0, 0, 0];
    for (const elf of elfs) {
        const elfTotalCalories = elf.totalCalories;
        if (elfTotalCalories > maxCalories[0]) {
            maxCalories[2] = maxCalories[1]
            maxCalories[1] = maxCalories[0]
            maxCalories[0] = elfTotalCalories;
        } else if (elfTotalCalories > maxCalories[1]) {
            maxCalories[2] = maxCalories[1]
            maxCalories[1] = elfTotalCalories;
        } else if (elfTotalCalories > maxCalories[2]) {
            maxCalories[2] = elfTotalCalories;
        }
    }
    console.log(maxCalories[0] + maxCalories[1] + maxCalories[2]);
    
} catch (err: any) {
    console.error(err.message);
}


function loadData(data: string) {
    const lines: string[] = data.split(/(\r\n|\r|\n)/);    
    let index: number = 0;
    let meals: Meal[] = [];
    const elfs: Elf[] = [];
    for (const rawLine of lines) {
        console.log(rawLine);
        
        if (rawLine.length === 1) {
            continue;
        }
        const line = rawLine.trim();
        
        if (line.length === 0) {
            elfs.push(new Elf(index++, meals));
            meals = [];
        } else {
            meals.push(new Meal(parseInt(line, 10)))
        }
    }
    return elfs;
}