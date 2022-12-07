import { readFile } from 'node:fs/promises';
import path from 'node:path';


const loadData = (filePath: string): Promise<string[]> => {
    try {
        return readFile(filePath, { encoding: 'utf8' })
            .then(parseData)
    } catch (err: any) {
        console.error(err.message);
        return Promise.reject()
    }
}

function parseData(data: string) {
    const lines: string[] = data.split(/(\r\n|\r|\n)/);
    return lines
    .filter((rawLine) => rawLine.length > 1)
    .map((rawLine) => rawLine.trim())
}

export default loadData;