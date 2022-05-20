class Player {
    constructor(isPlayer) {
        this.isPlayer = isPlayer;
    }

    sendAttack(board, row, col) {
        board.receiveAttack(row, col);
    }

    sendRandomAttack(board) {
        let row = this.getRandomInt(10);
        let col = this.getRandomInt(10);
        try {
            board.receiveAttack(row, col);
        } catch (err) {
            console.log(err);
            this.sendRandomAttack(board);
        }
        return board.getGridContent(row, col);
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
}

export default Player;