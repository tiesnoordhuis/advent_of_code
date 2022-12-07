import { readFile } from 'node:fs/promises';
import path from 'node:path';

class Strategy {
    opponentPlay: string;
    playerPlay: string = '';
    outcome: string;

    constructor(rawInput: string) {
        [this.opponentPlay, this.outcome] = rawInput.split(' ');
        if (this.outcome === 'X') {
            // Lose
            if (this.opponentPlay === 'A') {
                this.playerPlay = 'Z';
            } else if (this.opponentPlay === 'B') {
                this.playerPlay = 'X';
            } else if (this.opponentPlay === 'C') {
                this.playerPlay = 'Y';
            }
        } else if (this.outcome === 'Y') {
            // Draw
            if (this.opponentPlay === 'A') {
                this.playerPlay = 'X';
            } else if (this.opponentPlay === 'B') {
                this.playerPlay = 'Y';
            } else if (this.opponentPlay === 'C') {
                this.playerPlay = 'Z';
            }
        } else if (this.outcome === 'Z') {
            // Win
            if (this.opponentPlay === 'A') {
                this.playerPlay = 'Y';
            } else if (this.opponentPlay === 'B') {
                this.playerPlay = 'Z';
            } else if (this.opponentPlay === 'C') {
                this.playerPlay = 'X';
            }
        }
    }

    
    public get score(): number {
        let score = 0;
        if (this.playerPlay === 'X') {
            score += 1;
        } else if (this.playerPlay === 'Y') {
            score += 2;
        } else if (this.playerPlay === 'Z') {
            score += 3;
        }
        if (
            this.opponentPlay === 'A' && this.playerPlay === 'X' ||
            this.opponentPlay === 'B' && this.playerPlay === 'Y' ||
            this.opponentPlay === 'C' && this.playerPlay === 'Z'
        ) {
            score += 3;
        } else if (
            this.opponentPlay === 'A' && this.playerPlay === 'Y' ||
            this.opponentPlay === 'B' && this.playerPlay === 'Z' ||
            this.opponentPlay === 'C' && this.playerPlay === 'X'
        ) {
            score += 6;
        }
        console.log(`${this.opponentPlay} vs ${this.playerPlay}: ${score}`);
        
        return score;
    }
    
}

try {
    const importFile = path.join(import.meta.url.slice(5, -8), '/input.txt');
    const totalScore = await readFile(importFile, { encoding: 'utf8' })
        .then(loadData)
        .then(strategies => {
            return strategies.reduce((acc, strategy) => {
                return acc + strategy.score
            }, 0)
        })
    console.log(totalScore);
    
    
} catch (err: any) {
    console.error(err.message);
}


function loadData(data: string) {
    const regex = /(\v)/
    const groups: string[] = data.split(regex).map(it => it.trim());
    let strategies: Strategy[] = [];
    for (const strategy of groups) {
        if (strategy.length === 0) {
            continue;
        }
        strategies.push(new Strategy(strategy));        
    }
    return strategies;
}