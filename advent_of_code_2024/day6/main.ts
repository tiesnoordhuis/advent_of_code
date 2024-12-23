import { match } from 'assert';
import loadData from '../loading.ts';

const data = await loadData('./input.txt');

data.reverse();

const map: boolean[][] = data.map(row => row.split('').map(point => point === '#'))

type Vector = { x: number; y: number };
type UnitVector = { x: -1 | 0 | 1; y: -1 | 0 | 1 };
type Direction = 'up' | 'down' | 'left' | 'right';

const Directions: Record<Direction, UnitVector> = {
    up: { x: 0, y: 1 },
    down: { x: 0, y: -1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
};

class Guard {
    facing: UnitVector
    position: Vector
    mapSize: Vector
    visitedLocations: Set<string>
    visitedLocationsWithDirections: Set<string>
    hasLooped: boolean = false

    constructor(startLocation: Vector, startDirection: UnitVector, mapSize: Vector) {
        this.position = startLocation
        this.facing = startDirection
        this.mapSize = mapSize
        this.visitedLocations = new Set([`x${this.position.x}, y${this.position.y}`])
        this.visitedLocationsWithDirections = new Set([`x${this.position.x}, y${this.position.y}, dx${this.facing.x}, dy${this.facing.y}`])
    }

    move() {
        this.position.x += this.facing.x
        this.position.y += this.facing.y
        this.addToVisited()
    }

    turnIfObstructed(map: boolean[][]) {
        while (map[this.position.y + this.facing.y][this.position.x + this.facing.x]) {
            switch (this.facing) {
                case Directions.up:
                    this.facing = Directions.right
                    break;
                case Directions.right:
                    this.facing = Directions.down
                    break;
                case Directions.down:
                    this.facing = Directions.left
                    break;
                case Directions.left:
                    this.facing = Directions.up
                    break;
                default:
                    throw Error('invalid direction')
            }
        }
    }

    addToVisited() {
        this.visitedLocations.add(`x${this.position.x}, y${this.position.y}`)
        const locationWithDirection = `x${this.position.x}, y${this.position.y}, dx${this.facing.x}, dy${this.facing.y}`
        if (this.visitedLocationsWithDirections.has(locationWithDirection)) {
            this.hasLooped = true
            return
        }
        this.visitedLocationsWithDirections.add(locationWithDirection)
    }

    get reachedBorder(): boolean {
        return (
            this.position.x + this.facing.x > this.mapSize.x
            || this.position.x + this.facing.x < 0
            || this.position.y + this.facing.y > this.mapSize.y
            || this.position.y + this.facing.y < 0
        )
    }
    
}

const startY: number = data.findIndex(row => row.includes('^'))
const startX: number = data[startY].indexOf('^')

const guard = new Guard({x: startX, y: startY}, Directions.up, {x: map[0].length - 1, y: map.length - 1})

while(!guard.reachedBorder) {
    guard.turnIfObstructed(map)
    guard.move()
}
console.log(guard.visitedLocations.size);
console.log(guard.visitedLocationsWithDirections.size);

const mapsWithObstruction: boolean[][][] = []

guard.visitedLocations.forEach((visitedLocation) => {
    const [xString, yString] = visitedLocation.split(', ')
    const x: number = Number(xString.substring(1))
    const y: number = Number(yString.substring(1))
    const newMap = map.map((row) => [...row])
    newMap[y][x] = true
    mapsWithObstruction.push(newMap)
})

let loopedCounter = 0;

mapsWithObstruction.forEach((mapOption) => {
    const guard = new Guard({x: startX, y: startY}, Directions.up, {x: map[0].length - 1, y: map.length - 1})
    while (!guard.reachedBorder) {
        guard.turnIfObstructed(mapOption)
        guard.move()
        if (guard.hasLooped) {
            loopedCounter++
            break
        }
    }
})
console.log(loopedCounter);


