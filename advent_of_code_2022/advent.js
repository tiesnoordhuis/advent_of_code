import { readFile } from 'node:fs/promises';
const loadData = (filePath) => {
    try {
        return readFile(filePath, { encoding: 'utf8' })
            .then(parseData);
    }
    catch (err) {
        console.error(err.message);
        return Promise.reject();
    }
};
function parseData(data) {
    const lines = data.split(/(\r\n|\r|\n)/);
    return lines
        .filter((rawLine) => rawLine.length > 1)
        .map((rawLine) => rawLine.trim());
}
export default loadData;
