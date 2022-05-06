class Ship {
    constructor(size, hits = []) {
        this.size = size;
        this.hits = hits;
    }

    hit(position) {
        this.hits.push(position);
    }

    isSunk() {
        if (this.hits.length == this.size) {
            return true;
        } else {
            return false;
        }
    }
}

export default Ship;