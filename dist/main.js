/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/boardFactory.js":
/*!*****************************!*\
  !*** ./src/boardFactory.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _shipFactory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shipFactory */ "./src/shipFactory.js");


const SIZE = 10;

class Board {    
    constructor(grid = [], gridHits = []) {
        this.grid = grid;
        this.gridHits = gridHits;
        this.initialize();
    }

    initialize() {
        // create grid and missedShots
        this.grid = Array.from(Array(SIZE), () => new Array(SIZE));
        this.gridHits = Array.from(Array(SIZE), () => new Array(SIZE));
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
        /*
        check if ship is at coords
        if true, send hit to ship
        if false, record coords of miss
        */
        if (this.gridHits[row][col]) {
            throw new Error("Square has already been shot");
        }
        if (typeof this.grid[row][col] === "object" && this.grid[row][col] !== null) {
            this.grid[row][col].hit(1);
            this.gridHits[row][col] = true;
            return true;
        } else {
            this.gridHits[row][col] = true;
            return false;
        }
    }

    isMissedShot(row, col) {
        return this.gridHits[row][col]
            && typeof this.grid[row][col] !== "object";
    }

    hasAllShipsSunk() {
        // TODO ensure there are ships on the board if necessary
        // row
        for (let row = 0; row < SIZE; row++) {
            // col
            for (let col = 0; col < SIZE; col++) {
                // if ship and not hit
                if(typeof this.grid[row][col] === "object" && this.grid[row][col] !== null && !this.gridHits[row][col]) {
                    return false;
                }
            }
        }
        return true;
    }

    // 0 = empty, 1 = ship, 2 = missed shot, 3 = ship shot
    getGridContent(row, col) {
        if (typeof this.grid[row][col] === "object" && !this.gridHits[row][col]) {
            return "grid-ship";
        } else if (typeof this.grid[row][col] === "object" && this.grid[row][col] !== null && this.gridHits[row][col]) {
            return "grid-ship-hit";
        } else if (this.gridHits[row][col]) {
            return "grid-miss";
        }
        return "grid-empty";
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Board);

/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _boardFactory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./boardFactory */ "./src/boardFactory.js");
/* harmony import */ var _playerFactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./playerFactory */ "./src/playerFactory.js");
/* harmony import */ var _shipFactory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shipFactory */ "./src/shipFactory.js");




let playerBoard;
let computerBoard;
let player1;
let player2;

let shipSmallBoard1;
let shipMedBoard1;
let shipLargeBoard1;

let shipSmallBoard2;
let shipMedBoard2;
let shipLargeBoard2;

let isPlayerTurn = true;

function startGame() {
    playerBoard = new _boardFactory__WEBPACK_IMPORTED_MODULE_0__["default"]();
    computerBoard = new _boardFactory__WEBPACK_IMPORTED_MODULE_0__["default"]();
    player1 = new _playerFactory__WEBPACK_IMPORTED_MODULE_1__["default"](true);
    player2 = new _playerFactory__WEBPACK_IMPORTED_MODULE_1__["default"](false);

    shipSmallBoard1 = new _shipFactory__WEBPACK_IMPORTED_MODULE_2__["default"](2);
    shipMedBoard1 = new _shipFactory__WEBPACK_IMPORTED_MODULE_2__["default"](3);
    shipLargeBoard1 = new _shipFactory__WEBPACK_IMPORTED_MODULE_2__["default"](4);

    shipSmallBoard2 = new _shipFactory__WEBPACK_IMPORTED_MODULE_2__["default"](2);
    shipMedBoard2 = new _shipFactory__WEBPACK_IMPORTED_MODULE_2__["default"](3);
    shipLargeBoard2 = new _shipFactory__WEBPACK_IMPORTED_MODULE_2__["default"](4);

    placeShips();

    refreshGameBoard(playerBoard, true);
    refreshGameBoard(computerBoard, false);
}

function refreshGameBoard(board, isPlayer) {
    let boardDiv;

    if (isPlayer) {
        boardDiv = document.querySelector("#player-board");
    } else {
        boardDiv = document.querySelector("#computer-board");
    }

    boardDiv.innerHTML = "";

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const gridSquare = document.createElement("div");

            gridSquare.classList.add("gridSquare");
            gridSquare.setAttribute("style", "width:48px; height:48px");
            gridSquare.id = i.toString() + j.toString();

            if(!isPlayer) {
                gridSquare.addEventListener("click", playerSendAttack, false);
            }

            // TODO this is not functional, this does not work
            let gridContent = board.getGridContent(i, j);
            gridSquare.classList.add(gridContent);
            if (gridContent === "grid-miss") {
                gridSquare.textContent = "o";
            } else if (gridContent === "grid-ship-hit") {
                gridSquare.textContent = "X";
            }

            boardDiv.appendChild(gridSquare);
        }
    }

    if (board.hasAllShipsSunk()) {
        if (isPlayer) {
            alert("You is Win");
        } else {
            alert("You is Lose");
        }
    }
}

function playerSendAttack(event) {
    if (isPlayerTurn) {
        let coords = event.currentTarget.id;
        let row = coords.charAt(0);
        let col = coords.charAt(1);

        computerBoard.receiveAttack(row, col);

        if (computerBoard.getGridContent(row, col) !== "grid-ship-hit") {
            isPlayerTurn = false;
            computerSendAttack();
        }

        refreshGameBoard(computerBoard, false);
    }
}

function computerSendAttack() {
    let gridContent;
    do {
        gridContent = player2.sendRandomAttack(playerBoard);
    } while (gridContent === "grid-ship-hit" || gridContent === "grid-hit");

    refreshGameBoard(playerBoard, true);

    isPlayerTurn = true;
}

function placeShips() {
    playerBoard.placeShip(shipSmallBoard1, 0, 0);
    playerBoard.placeShip(shipMedBoard1, 0, 2);
    playerBoard.placeShip(shipLargeBoard1, 0, 5);

    computerBoard.placeShip(shipSmallBoard2, 0, 0);
    computerBoard.placeShip(shipMedBoard2, 0, 2);
    computerBoard.placeShip(shipLargeBoard2, 0, 5);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (startGame);


/***/ }),

/***/ "./src/playerFactory.js":
/*!******************************!*\
  !*** ./src/playerFactory.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);

/***/ }),

/***/ "./src/shipFactory.js":
/*!****************************!*\
  !*** ./src/shipFactory.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Ship {
    constructor(size, isVertical = true, hits = []) {
        this.size = size;
        this.isVertical = isVertical;
        this.hits = hits;
    }

    hit(position) {
        this.hits.push(position);
    }

    isSunk() {
        return this.hits.length == this.size;
    }

    // TODO need reference to ship
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ship);

/***/ }),

/***/ "./src/website.js":
/*!************************!*\
  !*** ./src/website.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game.js */ "./src/game.js");


function initializeWebsite() {
    // TODO initial DOM content creation
    (0,_game_js__WEBPACK_IMPORTED_MODULE_0__["default"])();
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (initializeWebsite);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _website__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./website */ "./src/website.js");


(0,_website__WEBPACK_IMPORTED_MODULE_0__["default"])();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTjBDOztBQUUxQyxvREFBaUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2JvYXJkRmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXJGYWN0b3J5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcEZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy93ZWJzaXRlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTaGlwIGZyb20gJy4vc2hpcEZhY3RvcnknO1xuXG5jb25zdCBTSVpFID0gMTA7XG5cbmNsYXNzIEJvYXJkIHsgICAgXG4gICAgY29uc3RydWN0b3IoZ3JpZCA9IFtdLCBncmlkSGl0cyA9IFtdKSB7XG4gICAgICAgIHRoaXMuZ3JpZCA9IGdyaWQ7XG4gICAgICAgIHRoaXMuZ3JpZEhpdHMgPSBncmlkSGl0cztcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgLy8gY3JlYXRlIGdyaWQgYW5kIG1pc3NlZFNob3RzXG4gICAgICAgIHRoaXMuZ3JpZCA9IEFycmF5LmZyb20oQXJyYXkoU0laRSksICgpID0+IG5ldyBBcnJheShTSVpFKSk7XG4gICAgICAgIHRoaXMuZ3JpZEhpdHMgPSBBcnJheS5mcm9tKEFycmF5KFNJWkUpLCAoKSA9PiBuZXcgQXJyYXkoU0laRSkpO1xuICAgIH1cblxuICAgIHBsYWNlU2hpcChzaGlwLCByb3csIGNvbCkge1xuICAgICAgICBpZihzaGlwLmlzVmVydGljYWwpIHtcbiAgICAgICAgICAgIC8vIGdvIGRvd24gZnJvbSBzdGFydCBwb3NcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSByb3c7IGkgPCAoc2hpcC5zaXplICsgcm93KTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ncmlkW2ldW2NvbF0gPSBzaGlwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZih0aGlzLmdyaWRbcm93XVtjb2xdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGdvIHJpZ2h0IGZyb20gc3RhcnQgcG9zXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gY29sOyBpIDwgc2hpcC5zaXplICsgY29sOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWRbcm93XVtpXSA9IHNoaXA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxuXG4gICAgcmVjZWl2ZUF0dGFjayhyb3csIGNvbCkge1xuICAgICAgICAvKlxuICAgICAgICBjaGVjayBpZiBzaGlwIGlzIGF0IGNvb3Jkc1xuICAgICAgICBpZiB0cnVlLCBzZW5kIGhpdCB0byBzaGlwXG4gICAgICAgIGlmIGZhbHNlLCByZWNvcmQgY29vcmRzIG9mIG1pc3NcbiAgICAgICAgKi9cbiAgICAgICAgaWYgKHRoaXMuZ3JpZEhpdHNbcm93XVtjb2xdKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcXVhcmUgaGFzIGFscmVhZHkgYmVlbiBzaG90XCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5ncmlkW3Jvd11bY29sXSA9PT0gXCJvYmplY3RcIiAmJiB0aGlzLmdyaWRbcm93XVtjb2xdICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmdyaWRbcm93XVtjb2xdLmhpdCgxKTtcbiAgICAgICAgICAgIHRoaXMuZ3JpZEhpdHNbcm93XVtjb2xdID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ncmlkSGl0c1tyb3ddW2NvbF0gPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNNaXNzZWRTaG90KHJvdywgY29sKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyaWRIaXRzW3Jvd11bY29sXVxuICAgICAgICAgICAgJiYgdHlwZW9mIHRoaXMuZ3JpZFtyb3ddW2NvbF0gIT09IFwib2JqZWN0XCI7XG4gICAgfVxuXG4gICAgaGFzQWxsU2hpcHNTdW5rKCkge1xuICAgICAgICAvLyBUT0RPIGVuc3VyZSB0aGVyZSBhcmUgc2hpcHMgb24gdGhlIGJvYXJkIGlmIG5lY2Vzc2FyeVxuICAgICAgICAvLyByb3dcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgU0laRTsgcm93KyspIHtcbiAgICAgICAgICAgIC8vIGNvbFxuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgU0laRTsgY29sKyspIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBzaGlwIGFuZCBub3QgaGl0XG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIHRoaXMuZ3JpZFtyb3ddW2NvbF0gPT09IFwib2JqZWN0XCIgJiYgdGhpcy5ncmlkW3Jvd11bY29sXSAhPT0gbnVsbCAmJiAhdGhpcy5ncmlkSGl0c1tyb3ddW2NvbF0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyAwID0gZW1wdHksIDEgPSBzaGlwLCAyID0gbWlzc2VkIHNob3QsIDMgPSBzaGlwIHNob3RcbiAgICBnZXRHcmlkQ29udGVudChyb3csIGNvbCkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuZ3JpZFtyb3ddW2NvbF0gPT09IFwib2JqZWN0XCIgJiYgIXRoaXMuZ3JpZEhpdHNbcm93XVtjb2xdKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJncmlkLXNoaXBcIjtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5ncmlkW3Jvd11bY29sXSA9PT0gXCJvYmplY3RcIiAmJiB0aGlzLmdyaWRbcm93XVtjb2xdICE9PSBudWxsICYmIHRoaXMuZ3JpZEhpdHNbcm93XVtjb2xdKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJncmlkLXNoaXAtaGl0XCI7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5ncmlkSGl0c1tyb3ddW2NvbF0pIHtcbiAgICAgICAgICAgIHJldHVybiBcImdyaWQtbWlzc1wiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcImdyaWQtZW1wdHlcIjtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJvYXJkOyIsImltcG9ydCBCb2FyZCBmcm9tIFwiLi9ib2FyZEZhY3RvcnlcIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vcGxheWVyRmFjdG9yeVwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcEZhY3RvcnlcIjtcblxubGV0IHBsYXllckJvYXJkO1xubGV0IGNvbXB1dGVyQm9hcmQ7XG5sZXQgcGxheWVyMTtcbmxldCBwbGF5ZXIyO1xuXG5sZXQgc2hpcFNtYWxsQm9hcmQxO1xubGV0IHNoaXBNZWRCb2FyZDE7XG5sZXQgc2hpcExhcmdlQm9hcmQxO1xuXG5sZXQgc2hpcFNtYWxsQm9hcmQyO1xubGV0IHNoaXBNZWRCb2FyZDI7XG5sZXQgc2hpcExhcmdlQm9hcmQyO1xuXG5sZXQgaXNQbGF5ZXJUdXJuID0gdHJ1ZTtcblxuZnVuY3Rpb24gc3RhcnRHYW1lKCkge1xuICAgIHBsYXllckJvYXJkID0gbmV3IEJvYXJkKCk7XG4gICAgY29tcHV0ZXJCb2FyZCA9IG5ldyBCb2FyZCgpO1xuICAgIHBsYXllcjEgPSBuZXcgUGxheWVyKHRydWUpO1xuICAgIHBsYXllcjIgPSBuZXcgUGxheWVyKGZhbHNlKTtcblxuICAgIHNoaXBTbWFsbEJvYXJkMSA9IG5ldyBTaGlwKDIpO1xuICAgIHNoaXBNZWRCb2FyZDEgPSBuZXcgU2hpcCgzKTtcbiAgICBzaGlwTGFyZ2VCb2FyZDEgPSBuZXcgU2hpcCg0KTtcblxuICAgIHNoaXBTbWFsbEJvYXJkMiA9IG5ldyBTaGlwKDIpO1xuICAgIHNoaXBNZWRCb2FyZDIgPSBuZXcgU2hpcCgzKTtcbiAgICBzaGlwTGFyZ2VCb2FyZDIgPSBuZXcgU2hpcCg0KTtcblxuICAgIHBsYWNlU2hpcHMoKTtcblxuICAgIHJlZnJlc2hHYW1lQm9hcmQocGxheWVyQm9hcmQsIHRydWUpO1xuICAgIHJlZnJlc2hHYW1lQm9hcmQoY29tcHV0ZXJCb2FyZCwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiByZWZyZXNoR2FtZUJvYXJkKGJvYXJkLCBpc1BsYXllcikge1xuICAgIGxldCBib2FyZERpdjtcblxuICAgIGlmIChpc1BsYXllcikge1xuICAgICAgICBib2FyZERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGxheWVyLWJvYXJkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGJvYXJkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb21wdXRlci1ib2FyZFwiKTtcbiAgICB9XG5cbiAgICBib2FyZERpdi5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICAgICAgY29uc3QgZ3JpZFNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZChcImdyaWRTcXVhcmVcIik7XG4gICAgICAgICAgICBncmlkU3F1YXJlLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwid2lkdGg6NDhweDsgaGVpZ2h0OjQ4cHhcIik7XG4gICAgICAgICAgICBncmlkU3F1YXJlLmlkID0gaS50b1N0cmluZygpICsgai50b1N0cmluZygpO1xuXG4gICAgICAgICAgICBpZighaXNQbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBncmlkU3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwbGF5ZXJTZW5kQXR0YWNrLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRPRE8gdGhpcyBpcyBub3QgZnVuY3Rpb25hbCwgdGhpcyBkb2VzIG5vdCB3b3JrXG4gICAgICAgICAgICBsZXQgZ3JpZENvbnRlbnQgPSBib2FyZC5nZXRHcmlkQ29udGVudChpLCBqKTtcbiAgICAgICAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZChncmlkQ29udGVudCk7XG4gICAgICAgICAgICBpZiAoZ3JpZENvbnRlbnQgPT09IFwiZ3JpZC1taXNzXCIpIHtcbiAgICAgICAgICAgICAgICBncmlkU3F1YXJlLnRleHRDb250ZW50ID0gXCJvXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGdyaWRDb250ZW50ID09PSBcImdyaWQtc2hpcC1oaXRcIikge1xuICAgICAgICAgICAgICAgIGdyaWRTcXVhcmUudGV4dENvbnRlbnQgPSBcIlhcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYm9hcmREaXYuYXBwZW5kQ2hpbGQoZ3JpZFNxdWFyZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYm9hcmQuaGFzQWxsU2hpcHNTdW5rKCkpIHtcbiAgICAgICAgaWYgKGlzUGxheWVyKSB7XG4gICAgICAgICAgICBhbGVydChcIllvdSBpcyBXaW5cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydChcIllvdSBpcyBMb3NlXCIpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBwbGF5ZXJTZW5kQXR0YWNrKGV2ZW50KSB7XG4gICAgaWYgKGlzUGxheWVyVHVybikge1xuICAgICAgICBsZXQgY29vcmRzID0gZXZlbnQuY3VycmVudFRhcmdldC5pZDtcbiAgICAgICAgbGV0IHJvdyA9IGNvb3Jkcy5jaGFyQXQoMCk7XG4gICAgICAgIGxldCBjb2wgPSBjb29yZHMuY2hhckF0KDEpO1xuXG4gICAgICAgIGNvbXB1dGVyQm9hcmQucmVjZWl2ZUF0dGFjayhyb3csIGNvbCk7XG5cbiAgICAgICAgaWYgKGNvbXB1dGVyQm9hcmQuZ2V0R3JpZENvbnRlbnQocm93LCBjb2wpICE9PSBcImdyaWQtc2hpcC1oaXRcIikge1xuICAgICAgICAgICAgaXNQbGF5ZXJUdXJuID0gZmFsc2U7XG4gICAgICAgICAgICBjb21wdXRlclNlbmRBdHRhY2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlZnJlc2hHYW1lQm9hcmQoY29tcHV0ZXJCb2FyZCwgZmFsc2UpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY29tcHV0ZXJTZW5kQXR0YWNrKCkge1xuICAgIGxldCBncmlkQ29udGVudDtcbiAgICBkbyB7XG4gICAgICAgIGdyaWRDb250ZW50ID0gcGxheWVyMi5zZW5kUmFuZG9tQXR0YWNrKHBsYXllckJvYXJkKTtcbiAgICB9IHdoaWxlIChncmlkQ29udGVudCA9PT0gXCJncmlkLXNoaXAtaGl0XCIgfHwgZ3JpZENvbnRlbnQgPT09IFwiZ3JpZC1oaXRcIik7XG5cbiAgICByZWZyZXNoR2FtZUJvYXJkKHBsYXllckJvYXJkLCB0cnVlKTtcblxuICAgIGlzUGxheWVyVHVybiA9IHRydWU7XG59XG5cbmZ1bmN0aW9uIHBsYWNlU2hpcHMoKSB7XG4gICAgcGxheWVyQm9hcmQucGxhY2VTaGlwKHNoaXBTbWFsbEJvYXJkMSwgMCwgMCk7XG4gICAgcGxheWVyQm9hcmQucGxhY2VTaGlwKHNoaXBNZWRCb2FyZDEsIDAsIDIpO1xuICAgIHBsYXllckJvYXJkLnBsYWNlU2hpcChzaGlwTGFyZ2VCb2FyZDEsIDAsIDUpO1xuXG4gICAgY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoc2hpcFNtYWxsQm9hcmQyLCAwLCAwKTtcbiAgICBjb21wdXRlckJvYXJkLnBsYWNlU2hpcChzaGlwTWVkQm9hcmQyLCAwLCAyKTtcbiAgICBjb21wdXRlckJvYXJkLnBsYWNlU2hpcChzaGlwTGFyZ2VCb2FyZDIsIDAsIDUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFydEdhbWU7XG4iLCJjbGFzcyBQbGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKGlzUGxheWVyKSB7XG4gICAgICAgIHRoaXMuaXNQbGF5ZXIgPSBpc1BsYXllcjtcbiAgICB9XG5cbiAgICBzZW5kQXR0YWNrKGJvYXJkLCByb3csIGNvbCkge1xuICAgICAgICBib2FyZC5yZWNlaXZlQXR0YWNrKHJvdywgY29sKTtcbiAgICB9XG5cbiAgICBzZW5kUmFuZG9tQXR0YWNrKGJvYXJkKSB7XG4gICAgICAgIGxldCByb3cgPSB0aGlzLmdldFJhbmRvbUludCgxMCk7XG4gICAgICAgIGxldCBjb2wgPSB0aGlzLmdldFJhbmRvbUludCgxMCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBib2FyZC5yZWNlaXZlQXR0YWNrKHJvdywgY29sKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgdGhpcy5zZW5kUmFuZG9tQXR0YWNrKGJvYXJkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYm9hcmQuZ2V0R3JpZENvbnRlbnQocm93LCBjb2wpO1xuICAgIH1cblxuICAgIGdldFJhbmRvbUludChtYXgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1heCk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7IiwiY2xhc3MgU2hpcCB7XG4gICAgY29uc3RydWN0b3Ioc2l6ZSwgaXNWZXJ0aWNhbCA9IHRydWUsIGhpdHMgPSBbXSkge1xuICAgICAgICB0aGlzLnNpemUgPSBzaXplO1xuICAgICAgICB0aGlzLmlzVmVydGljYWwgPSBpc1ZlcnRpY2FsO1xuICAgICAgICB0aGlzLmhpdHMgPSBoaXRzO1xuICAgIH1cblxuICAgIGhpdChwb3NpdGlvbikge1xuICAgICAgICB0aGlzLmhpdHMucHVzaChwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgaXNTdW5rKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oaXRzLmxlbmd0aCA9PSB0aGlzLnNpemU7XG4gICAgfVxuXG4gICAgLy8gVE9ETyBuZWVkIHJlZmVyZW5jZSB0byBzaGlwXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXA7IiwiaW1wb3J0IHN0YXJ0R2FtZSBmcm9tIFwiLi9nYW1lLmpzXCI7XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVXZWJzaXRlKCkge1xuICAgIC8vIFRPRE8gaW5pdGlhbCBET00gY29udGVudCBjcmVhdGlvblxuICAgIHN0YXJ0R2FtZSgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpbml0aWFsaXplV2Vic2l0ZTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBpbml0aWFsaXplV2Vic2l0ZSBmcm9tIFwiLi93ZWJzaXRlXCI7XG5cbmluaXRpYWxpemVXZWJzaXRlKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=