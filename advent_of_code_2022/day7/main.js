import loadData from "../advent.js";
class ElfFile {
    name;
    size;
    constructor(name, size) {
        this.name = name;
        this.size = size;
    }
}
class Folder {
    name;
    content = [];
    parent;
    constructor(name, parent) {
        this.name = name;
        this.parent = parent;
    }
    folderByName(name) {
        const folder = this.content.find(structure => structure instanceof Folder && structure.name === name);
        if (folder === undefined) {
            throw new Error(`No folder ${name} exists`);
        }
        return folder;
    }
    get contentSize() {
        return this.content.reduce((acc, structure) => {
            if (structure instanceof ElfFile) {
                return acc + structure.size;
            }
            else if (structure instanceof Folder) {
                return acc + structure.contentSize;
            }
            return acc;
        }, 0);
    }
}
class Command {
    function;
    arg;
    outputs = [];
    constructor(input) {
        if (input.startsWith('ls')) {
            this.function = 'ls';
        }
        else if (input.startsWith('cd')) {
            this.function = 'cd';
            this.arg = input.substring(3);
        }
        else {
            throw new TypeError(`invalid argument ${input}`);
        }
    }
    set output(output) {
        this.outputs.push(output);
    }
}
function sumSmallDirSizes(folder) {
    return folder.content.reduce((acc, structure) => {
        if (structure instanceof Folder) {
            acc += sumSmallDirSizes(structure);
            if (structure.contentSize < 100000) {
                acc += structure.contentSize;
            }
        }
        return acc;
    }, 0);
}
function findSmallestFolderOver(folder, minSize, currentSmallest = Number.POSITIVE_INFINITY) {
    if (currentSmallest > folder.contentSize && folder.contentSize > minSize) {
        currentSmallest = folder.contentSize;
    }
    return folder.content.reduce((smallest, structure) => {
        if (structure instanceof Folder) {
            return findSmallestFolderOver(structure, minSize, smallest);
        }
        return smallest;
    }, currentSmallest);
}
loadData('input.txt')
    .then((lines) => {
    return lines.reduce((acc, line) => {
        if (line.startsWith('$')) {
            acc.push(new Command(line.substring(2)));
        }
        else {
            acc[acc.length - 1].output = line;
        }
        return acc;
    }, []);
})
    .then((commands) => {
    const rootFolder = new Folder('root', {});
    let currentFolder = new Folder('/', rootFolder);
    rootFolder.content.push(currentFolder);
    commands.shift();
    commands.forEach((command) => {
        if (command.function === 'ls') {
            command.outputs.forEach((output) => {
                if (output.startsWith('dir')) {
                    currentFolder.content.push(new Folder(output.substring(4), currentFolder));
                }
                else {
                    const [rawSize, name] = output.split(' ');
                    currentFolder.content.push(new ElfFile(name, Number(rawSize)));
                }
            });
        }
        else if (command.function = 'cd') {
            if (command.arg === '..') {
                currentFolder = currentFolder.parent;
            }
            else {
                currentFolder = currentFolder.folderByName(command.arg);
            }
        }
    });
    return rootFolder;
})
    .then(rootFolder => {
    console.log(`sum of small directories is ${sumSmallDirSizes(rootFolder)}`);
    return rootFolder;
})
    .then(rootFolder => {
    const availableSpace = 70000000 - rootFolder.contentSize;
    const neededSpace = 30000000 - availableSpace;
    console.log(neededSpace);
    console.log(findSmallestFolderOver(rootFolder, neededSpace));
});
