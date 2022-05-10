import Ship from './shipFactory';

const SIZE = 10;

class Board {    
    constructor(grid = [], missedShots = []) {
        this.grid = grid;
        this.missedShots = missedShots;
        this.initialize();
    }

    initialize() {
        // create grid and missedShots
        this.grid = Array.from(Array(SIZE), () => new Array(SIZE));
        this.missedShots = Array.from(Array(SIZE), () => new Array(SIZE));
    }

    placeShip(ship, row, col) {
        if(ship.isVertical) {
            // go down from start pos
            for (let i = row; i < (ship.size + row); i++) {
                this.grid[i][col] = ship;
            }
            return typeof(this.grid[row][col]);
        } else {
            // go right from start pos
            for (let i = col; i < ship.size + col; i++) {
                this.grid[row][i] = ship;
            }
        }
        
    }

    receiveAttack(row, col) {
        // check if ship is at coords
        // if true, send hit to ship
        // if false, record coords of miss
        if (typeof this.grid[row][col] === "object" && this.grid[row][col] !== null) {
            this.grid[row][col].hit(1);
            return true;
        } else {
            this.missedShots[row][col] = true;
            return false;
        }
    }

    isMissedShot(row, col) {
        return this.missedShots[row][col];
    }
}

export default Board;