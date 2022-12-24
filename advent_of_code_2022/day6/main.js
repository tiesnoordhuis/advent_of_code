import { exit } from "node:process";
import loadData from "../advent.js";
// const datastream = 'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw'
const datastream = (await loadData('input.txt'))[0];
console.log(datastream);
function startMarkerDetected(substring) {
    const set = new Set(substring.split(''));
    console.log(set, substring);
    return set.size === substring.length;
}
for (let index = 14; index < datastream.length; index++) {
    if (startMarkerDetected(datastream.substring(index - 14, index))) {
        console.log(`start found at ${index}`);
        exit();
    }
}
