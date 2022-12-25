import loadData from "../advent.js";
class Tree {
    height;
    visible = false;
    viewDistances = [];
    constructor(height) {
        this.height = height;
    }
    get scenicScore() {
        return this.viewDistances.reduce((acc, distance) => acc * distance, 1);
    }
}
class Forest {
    grid = [[]];
    constructor(grid) {
        this.grid = grid;
    }
    get transposedGrid() {
        return this.grid[0].map((_, colIndex) => this.grid.map(row => row[colIndex]));
    }
    lookAtRow(row) {
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
            this.lookAtRow(row);
            this.considerLookOutSpotsInRow(row);
            this.lookAtRow([...row].reverse());
            this.considerLookOutSpotsInRow([...row].reverse());
        }
        for (const row of this.transposedGrid) {
            this.lookAtRow(row);
            this.considerLookOutSpotsInRow(row);
            this.lookAtRow([...row].reverse());
            this.considerLookOutSpotsInRow([...row].reverse());
        }
    }
    viewDistanceFromLookOutSpotInRow(row) {
        let lookOutSpot = row.shift();
        let distance = 0;
        for (const tree of row) {
            distance += 1;
            if (tree.height >= lookOutSpot.height) {
                break;
            }
        }
        return lookOutSpot.viewDistances.push(distance);
    }
    considerLookOutSpotsInRow(row) {
        row.forEach((_, index, row) => this.viewDistanceFromLookOutSpotInRow(row.slice(index)));
    }
    get totalVisibleTrees() {
        this.lookAllAround();
        return this.grid.reduce((accOuter, row) => {
            return accOuter + row.reduce((accInner, tree) => accInner + Number(tree.visible), 0);
        }, 0);
    }
    get mostScenicTree() {
        let heighestScore = 0;
        for (const row of this.grid) {
            for (const tree of row) {
                if (tree.scenicScore > heighestScore) {
                    heighestScore = tree.scenicScore;
                }
            }
        }
        return heighestScore;
    }
}
loadData('input.txt')
    .then((lines) => {
    const forest = new Forest(lines.map((line) => [...line].map(height => new Tree(Number(height)))));
    console.log(`total visible trees is ${forest.totalVisibleTrees}`);
    console.log(`the most scenic tree has as score of ${forest.mostScenicTree}`);
});
