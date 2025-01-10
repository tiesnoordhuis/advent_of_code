import loadData from '../loading.ts';

const data = await loadData('./input.txt');

const diskMap = data[0]

const expandMap = (map: string) => {
    let id = 0;
    const result = []
    for (let index = 0; index < map.length; index++) {
        if (index % 2) {
            const array = Array.from({length: Number(map[index])}, () => '.')
            result.push(...array)
        } else {
            const array = Array.from({length: Number(map[index])}, () => id)
            result.push(...array)
            id++
        }
    }
    return result
}

const expandedMap = expandMap(diskMap);
console.log(expandedMap.join(''));


const compactMap = (map: (number|'.')[]) => {
    let spaceNeeded: number = map.reduce((prev: number, curr): number => {
        if (curr === '.') {
            return prev
        }
        return prev + 1
    }, 0) as number
    console.log(`spaceNeed: ${spaceNeeded}`);
    
    for (let index = map.length - 1; index >= spaceNeeded; index--) {
        const element = map[index];
        if (element === '.') {
            continue
        }

        const dotIndex = map.findIndex((needle) => needle === '.')
        // console.log(`swapping ${element} at ${index}, with '.' at ${dotIndex}`);

        map[dotIndex] = element
        map[index] = '.'
        // console.log(map.join(''));
    }
    return map
}

const compactedMap = compactMap(expandedMap)
console.log(compactedMap.join(''));

const calcChecksum = (map: (number|'.')[]) => {
    let sum = 0;
    for (let index = 0; index < map.length; index++) {
        const element = map[index];
        if (element === '.') {
            break
        }
        sum += (index * Number(element))
    }
    return sum
}

const checksum = calcChecksum(compactedMap)
console.log(checksum);

