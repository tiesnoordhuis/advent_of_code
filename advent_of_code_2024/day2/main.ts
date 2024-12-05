import loadData from '../loading.ts'; 

const data = await loadData('./input.txt');

const reports: number[][] = data.map(line => line.split(' ').map(Number))

const unsafeReports = reports.filter(report => !isSafe(report, report[0] > report[1] ? 1 : -1))

console.log(reports.length - unsafeReports.length);

const realyUnsafeReports = unsafeReports.filter(unsafeReport => !isSafeWithDamper(unsafeReport))

console.log(reports.length - realyUnsafeReports.length);

function isSafeWithDamper(report: number[]) {
    const variants = []
    for (let index = 0; index < report.length; index++) {
        variants.push([...report.slice(0, index), ...report.slice(index + 1)])
    }
    return variants.some(variant => isSafe(variant, variant[0] > variant[1] ? 1 : -1))
}

function isSafe(report: number[], direction: 1|-1) {
    for (let index = 0; index < report.length - 1; index++) {
        const diff = (report[index] - report[index + 1]) * direction;
        if (diff >= 1 && diff <= 3) {
            continue
        }
        return false;
    }
    return true;
}

