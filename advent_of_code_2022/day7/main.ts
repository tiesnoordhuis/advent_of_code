import loadData from "../advent.js"

type StorageStructure = ElfFile | Folder;

class ElfFile {
    public name: string;
    public size: number;

    constructor(name: string, size: number) {
        this.name = name;
        this.size = size;
    }
}

class Folder {
    public name: string;
    public content: StorageStructure[] = [];
    public parent: Folder;
    
    constructor(name: string, parent: Folder) {
        this.name = name;
        this.parent = parent;
    }

    
    public folderByName(name: string): Folder {
        const folder = this.content.find(structure => structure instanceof Folder && structure.name === name);
        if (folder === undefined) {
            throw new Error(`No folder ${name} exists`);
        }
        return folder as Folder;
    }

    public get contentSize(): number {
        return this.content.reduce((acc, structure) => {
            if (structure instanceof ElfFile) {
                return acc + structure.size;
            } else if (structure instanceof Folder) {
                return acc + structure.contentSize
            } 
            return acc
        }, 0);
    }
    
}

type Function = 'ls' | 'cd'

class Command {
    public function: Function;
    public arg?: string;
    public outputs: string[] = [];

    constructor(input: string) {
        if (input.startsWith('ls')) {
            this.function = 'ls';
        } else if (input.startsWith('cd')) {
            this.function = 'cd';
            this.arg = input.substring(3)
        } else {
            throw new TypeError(`invalid argument ${input}`);
        }
    }
    
    public set output(output : string) {
        this.outputs.push(output);
    }
}

function sumSmallDirSizes(folder: Folder): number {
    return folder.content.reduce((acc, structure) => {
        if (structure instanceof Folder) {
            acc += sumSmallDirSizes(structure)
            if (structure.contentSize < 100000) {
                acc += structure.contentSize
            }
        }
        return acc;
    }, 0)
}

function findSmallestFolderOver(folder: Folder, minSize: number, currentSmallest: number = Number.POSITIVE_INFINITY): number {
    if (currentSmallest > folder.contentSize && folder.contentSize > minSize) {
        currentSmallest = folder.contentSize;
    }
    return folder.content.reduce((smallest, structure) => {
        if (structure instanceof Folder) {
            return findSmallestFolderOver(structure, minSize, smallest)
        }
        return smallest
    }, currentSmallest);
}


loadData('input.txt')
    .then((lines: string[]) => {
        return lines.reduce((acc: Command[], line: string): Command[] => {
            if (line.startsWith('$')) {
                acc.push(new Command(line.substring(2)));
            } else {
                acc[acc.length - 1].output = line;
            }
            return acc;
        }, [])
    })
    .then((commands: Command[]) => {
        const rootFolder = new Folder('root', {} as Folder);
        let currentFolder: Folder = new Folder('/', rootFolder);
        rootFolder.content.push(currentFolder);
        commands.shift()
        commands.forEach((command: Command) => {
            if (command.function === 'ls') {
                command.outputs.forEach((output: string) => {
                    if (output.startsWith('dir')) {
                        currentFolder.content.push(new Folder(output.substring(4), currentFolder))
                    } else {
                        const [rawSize, name] = output.split(' ');
                        currentFolder.content.push(new ElfFile(name, Number(rawSize)))
                    }
                })
            } else if (command.function = 'cd') {
                if (command.arg === '..') {
                    currentFolder = currentFolder.parent;
                } else {
                    currentFolder = currentFolder.folderByName(command.arg as string)
                    
                }
            }
        })
        return rootFolder
    })
    .then(rootFolder => {
        console.log(`sum of small directories is ${sumSmallDirSizes(rootFolder)}`);
        return rootFolder;
    })
    .then(rootFolder => {
        const availableSpace = 70000000 - rootFolder.contentSize;
        const neededSpace = 30000000 - availableSpace
        console.log(`Smalles Folder larger than needed Space has size ${findSmallestFolderOver(rootFolder, neededSpace)}`);  
    })
