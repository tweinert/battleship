class Ship {
    constructor(size, hits = []) {
        this.size = size;
        this.hits = hits;
    }

    hit(position) {
        this.hits.push(position);
    }

    isSunk() {
        return this.hits.length == this.size
    }
}

export default Ship;