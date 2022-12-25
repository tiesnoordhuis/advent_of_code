import loadData from "../advent.js"

class Tree {
    public height: number;
    public visible: boolean = false;
    public viewDistances: number[] = [];

    constructor(height: number) {
        this.height = height;
    }
    
    public get scenicScore(): number {
        return this.viewDistances.reduce((acc, distance) => acc * distance, 1)
    }
    
}

class Forest {
    public grid: Tree[][] = [[]];

    constructor(grid: Tree[][]) {
        this.grid = grid;
    }
    
    public get transposedGrid(): Tree[][] {
        return this.grid[0].map((_, colIndex) => this.grid.map(row => row[colIndex]));
    }
    

    lookAtRow(row: Tree[]) {
        let visibleHeight = -1;
        for (const tree of row) {
            if (tree.height > visibleHeight) {
                tree.visible = true;
                visibleHeight = tree.height;
            }
        }
    }

    lookAllAround() {
        for (const row of this.grid) {
            this.lookAtRow(row)
            this.considerLookOutSpotsInRow(row)
            this.lookAtRow([...row].reverse())
            this.considerLookOutSpotsInRow([...row].reverse())
        }
        for (const row of this.transposedGrid) {
            this.lookAtRow(row)
            this.considerLookOutSpotsInRow(row)
            this.lookAtRow([...row].reverse())
            this.considerLookOutSpotsInRow([...row].reverse())
        }        
    }

    viewDistanceFromLookOutSpotInRow(row: Tree[]) {
        let lookOutSpot = row.shift() as Tree;
        let distance = 0;
        for (const tree of row) {
            distance += 1;
            if (tree.height >= lookOutSpot.height) {
                break;
            }
        }
        return lookOutSpot.viewDistances.push(distance);
    }

    considerLookOutSpotsInRow(row: Tree[]) {
        row.forEach((_, index, row) => this.viewDistanceFromLookOutSpotInRow(row.slice(index)))
    }

    
    public get totalVisibleTrees(): number {
        this.lookAllAround();
        return this.grid.reduce((accOuter, row) => {
            return accOuter + row.reduce((accInner, tree) => accInner + Number(tree.visible), 0)
        }, 0)
    }

    
    public get mostScenicTree(): number {
        let heighestScore = 0;
        for (const row of this.grid) {
            for (const tree of row) {
                if (tree.scenicScore > heighestScore) {
                    heighestScore = tree.scenicScore;
                }
            }
        }
        return heighestScore
    }
    
    
}

loadData('input.txt')
    .then((lines: string[]) => {
        const forest = new Forest(
            lines.map((line) => [...line].map(height => new Tree(Number(height))))
        )
        console.log(`total visible trees is ${forest.totalVisibleTrees}`);
        console.log(`the most scenic tree has as score of ${forest.mostScenicTree}`);
    })
