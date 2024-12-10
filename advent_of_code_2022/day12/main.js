import loadData from "../advent.js";
import 'colors';
class Square {
    height;
    type;
    visited = false;
    toBeDeleted = false;
    constructor(elevationLetter) {
        const codepoint = elevationLetter.charCodeAt(0);
        switch (codepoint) {
            case 83:
                this.height = 0;
                this.type = 'Start';
                break;
            case 69:
                this.height = 25;
                this.type = 'End';
                break;
            default:
                this.height = codepoint - 97;
                break;
        }
    }
    toString() {
        const lastDigid = this.visited ? (this.height % 10).toString().inverse : (this.height % 10).toString();
        if (this.type) {
            return this.visited ? this.type.substring(0, 1).red.inverse : this.type.substring(0, 1).red;
        }
        else if (this.height < 10) {
            return lastDigid.blue;
        }
        else if (this.height < 20) {
            return lastDigid.green;
        }
        else {
            return lastDigid.yellow;
        }
    }
}
class Walker {
    stepCount = 0;
    visitedLocations = new Set();
    moveDecisions = [];
    positionWithMultipleNewMoves = [];
    positionWithNoNewMoves = new Set();
    x;
    y;
    constructor(position) {
        this.y = position.y;
        this.x = position.x;
    }
    isAt(position) {
        if (this.x === position.x && this.y === position.y) {
            return true;
        }
        return false;
    }
    posibleMoves(grid) {
        const unvisitedMoves = [];
        const visitedMoves = [];
        if (grid[this.y][this.x + 1] && grid[this.y][this.x + 1].height <= grid[this.y][this.x].height + 1) {
            if (grid[this.y][this.x + 1].visited) {
                visitedMoves.push({ y: this.y, x: this.x + 1 });
            }
            else {
                unvisitedMoves.push({ y: this.y, x: this.x + 1 });
            }
        }
        if (grid[this.y][this.x - 1] && grid[this.y][this.x - 1].height <= grid[this.y][this.x].height + 1) {
            if (grid[this.y][this.x - 1].visited) {
                visitedMoves.push({ y: this.y, x: this.x - 1 });
            }
            else {
                unvisitedMoves.push({ y: this.y, x: this.x - 1 });
            }
        }
        if (grid[this.y + 1] && grid[this.y + 1][this.x] && grid[this.y + 1][this.x].height <= grid[this.y][this.x].height + 1) {
            if (grid[this.y + 1][this.x].visited) {
                visitedMoves.push({ y: this.y + 1, x: this.x });
            }
            else {
                unvisitedMoves.push({ y: this.y + 1, x: this.x });
            }
        }
        if (grid[this.y - 1] && grid[this.y - 1][this.x] && grid[this.y - 1][this.x].height <= grid[this.y][this.x].height + 1) {
            if (grid[this.y - 1][this.x].visited) {
                visitedMoves.push({ y: this.y - 1, x: this.x });
            }
            else {
                unvisitedMoves.push({ y: this.y - 1, x: this.x });
            }
        }
        if (unvisitedMoves.length > 1) {
            this.positionWithMultipleNewMoves.push({ y: this.y, x: this.x });
        }
        if (unvisitedMoves.length === 0) {
            this.visitedLocations.delete(`x${this.x},y${this.y}`);
            this.positionWithNoNewMoves.add(`x${this.x},y${this.y}`);
        }
        return unvisitedMoves.length > 0 ? unvisitedMoves : [this.positionWithMultipleNewMoves.pop()];
    }
    move(move) {
        this.x = move.x;
        this.y = move.y;
        this.visitedLocations.add(`x${move.x},y${move.y}`);
        this.stepCount += 1;
    }
}
const findType = (grid, type) => {
    for (const [rowIndex, row] of grid.entries()) {
        for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
            const square = row[columnIndex];
            if (square && square?.type === type) {
                return { y: rowIndex, x: columnIndex };
            }
        }
    }
    throw Error(`not found ${type}`);
};
const findStart = (grid) => findType(grid, 'Start');
const findEnd = (grid) => findType(grid, 'End');
const displayGrid = (grid, walker) => {
    grid.forEach((line, rowIndex) => {
        let lineInstring = '';
        for (let columnIndex = 0; columnIndex < line.length; columnIndex++) {
            const square = line[columnIndex];
            if (walker.isAt({ y: rowIndex, x: columnIndex })) {
                lineInstring += 'W'.red.inverse;
            }
            else if (!square) {
                lineInstring += ' ';
            }
            else {
                lineInstring += square.toString();
            }
        }
        console.log(lineInstring);
    });
};
const reset = (grid) => {
    for (const [rowIndex, row] of grid.entries()) {
        for (const [columnIndex, square] of row.entries()) {
            if (!grid[rowIndex][columnIndex] || square.type === 'Start') {
                continue;
            }
            else if (square.visited) {
                square.visited = false;
            }
            else if (square.toBeDeleted) {
                delete grid[rowIndex][columnIndex];
            }
        }
    }
    return new Walker(findStart(grid));
};
console.log(await loadData('input.txt')
    .then(lines => {
    return lines.map(line => {
        return line.split('').map(elevationLetter => new Square(elevationLetter));
    });
})
    .then(grid => {
    let walker = new Walker(findStart(grid));
    const end = findEnd(grid);
    const walkedPaths = new Set();
    let i = 0;
    displayGrid(grid, walker);
    while (!(walker.stepCount === walker.visitedLocations.size && walker.isAt(end))) {
        i += 1;
        walker = reset(grid);
        while (!walker.isAt(end)) {
            const posibleMoves = walker.posibleMoves(grid);
            grid[walker.y][walker.x].visited = true;
            const move = posibleMoves[Math.floor(Math.random() * posibleMoves.length)];
            walker.move(move);
        }
        walker.positionWithNoNewMoves.forEach(pos => walkedPaths.add(pos));
        if (i % 10 === 0) {
            displayGrid(grid, walker);
            i = 0;
        }
    }
    displayGrid(grid, walker);
    return walker.stepCount;
}));