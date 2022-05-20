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
    } while (gridContent === "grid-ship-hit");

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
        board.receiveAttack(row, col);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QWlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9ib2FyZEZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVyRmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXBGYWN0b3J5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvd2Vic2l0ZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXBGYWN0b3J5JztcblxuY29uc3QgU0laRSA9IDEwO1xuXG5jbGFzcyBCb2FyZCB7ICAgIFxuICAgIGNvbnN0cnVjdG9yKGdyaWQgPSBbXSwgZ3JpZEhpdHMgPSBbXSkge1xuICAgICAgICB0aGlzLmdyaWQgPSBncmlkO1xuICAgICAgICB0aGlzLmdyaWRIaXRzID0gZ3JpZEhpdHM7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUoKSB7XG4gICAgICAgIC8vIGNyZWF0ZSBncmlkIGFuZCBtaXNzZWRTaG90c1xuICAgICAgICB0aGlzLmdyaWQgPSBBcnJheS5mcm9tKEFycmF5KFNJWkUpLCAoKSA9PiBuZXcgQXJyYXkoU0laRSkpO1xuICAgICAgICB0aGlzLmdyaWRIaXRzID0gQXJyYXkuZnJvbShBcnJheShTSVpFKSwgKCkgPT4gbmV3IEFycmF5KFNJWkUpKTtcbiAgICB9XG5cbiAgICBwbGFjZVNoaXAoc2hpcCwgcm93LCBjb2wpIHtcbiAgICAgICAgaWYoc2hpcC5pc1ZlcnRpY2FsKSB7XG4gICAgICAgICAgICAvLyBnbyBkb3duIGZyb20gc3RhcnQgcG9zXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gcm93OyBpIDwgKHNoaXAuc2l6ZSArIHJvdyk7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JpZFtpXVtjb2xdID0gc2hpcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YodGhpcy5ncmlkW3Jvd11bY29sXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBnbyByaWdodCBmcm9tIHN0YXJ0IHBvc1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IGNvbDsgaSA8IHNoaXAuc2l6ZSArIGNvbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ncmlkW3Jvd11baV0gPSBzaGlwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cblxuICAgIHJlY2VpdmVBdHRhY2socm93LCBjb2wpIHtcbiAgICAgICAgLypcbiAgICAgICAgY2hlY2sgaWYgc2hpcCBpcyBhdCBjb29yZHNcbiAgICAgICAgaWYgdHJ1ZSwgc2VuZCBoaXQgdG8gc2hpcFxuICAgICAgICBpZiBmYWxzZSwgcmVjb3JkIGNvb3JkcyBvZiBtaXNzXG4gICAgICAgICovXG4gICAgICAgIGlmICh0aGlzLmdyaWRIaXRzW3Jvd11bY29sXSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3F1YXJlIGhhcyBhbHJlYWR5IGJlZW4gc2hvdFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuZ3JpZFtyb3ddW2NvbF0gPT09IFwib2JqZWN0XCIgJiYgdGhpcy5ncmlkW3Jvd11bY29sXSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5ncmlkW3Jvd11bY29sXS5oaXQoMSk7XG4gICAgICAgICAgICB0aGlzLmdyaWRIaXRzW3Jvd11bY29sXSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZEhpdHNbcm93XVtjb2xdID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzTWlzc2VkU2hvdChyb3csIGNvbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkSGl0c1tyb3ddW2NvbF1cbiAgICAgICAgICAgICYmIHR5cGVvZiB0aGlzLmdyaWRbcm93XVtjb2xdICE9PSBcIm9iamVjdFwiO1xuICAgIH1cblxuICAgIGhhc0FsbFNoaXBzU3VuaygpIHtcbiAgICAgICAgLy8gVE9ETyBlbnN1cmUgdGhlcmUgYXJlIHNoaXBzIG9uIHRoZSBib2FyZCBpZiBuZWNlc3NhcnlcbiAgICAgICAgLy8gcm93XG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IFNJWkU7IHJvdysrKSB7XG4gICAgICAgICAgICAvLyBjb2xcbiAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IFNJWkU7IGNvbCsrKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgc2hpcCBhbmQgbm90IGhpdFxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiB0aGlzLmdyaWRbcm93XVtjb2xdID09PSBcIm9iamVjdFwiICYmIHRoaXMuZ3JpZFtyb3ddW2NvbF0gIT09IG51bGwgJiYgIXRoaXMuZ3JpZEhpdHNbcm93XVtjb2xdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gMCA9IGVtcHR5LCAxID0gc2hpcCwgMiA9IG1pc3NlZCBzaG90LCAzID0gc2hpcCBzaG90XG4gICAgZ2V0R3JpZENvbnRlbnQocm93LCBjb2wpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmdyaWRbcm93XVtjb2xdID09PSBcIm9iamVjdFwiICYmICF0aGlzLmdyaWRIaXRzW3Jvd11bY29sXSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiZ3JpZC1zaGlwXCI7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuZ3JpZFtyb3ddW2NvbF0gPT09IFwib2JqZWN0XCIgJiYgdGhpcy5ncmlkW3Jvd11bY29sXSAhPT0gbnVsbCAmJiB0aGlzLmdyaWRIaXRzW3Jvd11bY29sXSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiZ3JpZC1zaGlwLWhpdFwiO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZ3JpZEhpdHNbcm93XVtjb2xdKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJncmlkLW1pc3NcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJncmlkLWVtcHR5XCI7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCb2FyZDsiLCJpbXBvcnQgQm9hcmQgZnJvbSBcIi4vYm9hcmRGYWN0b3J5XCI7XG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL3BsYXllckZhY3RvcnlcIjtcbmltcG9ydCBTaGlwIGZyb20gXCIuL3NoaXBGYWN0b3J5XCI7XG5cbmxldCBwbGF5ZXJCb2FyZDtcbmxldCBjb21wdXRlckJvYXJkO1xubGV0IHBsYXllcjE7XG5sZXQgcGxheWVyMjtcblxubGV0IHNoaXBTbWFsbEJvYXJkMTtcbmxldCBzaGlwTWVkQm9hcmQxO1xubGV0IHNoaXBMYXJnZUJvYXJkMTtcblxubGV0IHNoaXBTbWFsbEJvYXJkMjtcbmxldCBzaGlwTWVkQm9hcmQyO1xubGV0IHNoaXBMYXJnZUJvYXJkMjtcblxubGV0IGlzUGxheWVyVHVybiA9IHRydWU7XG5cbmZ1bmN0aW9uIHN0YXJ0R2FtZSgpIHtcbiAgICBwbGF5ZXJCb2FyZCA9IG5ldyBCb2FyZCgpO1xuICAgIGNvbXB1dGVyQm9hcmQgPSBuZXcgQm9hcmQoKTtcbiAgICBwbGF5ZXIxID0gbmV3IFBsYXllcih0cnVlKTtcbiAgICBwbGF5ZXIyID0gbmV3IFBsYXllcihmYWxzZSk7XG5cbiAgICBzaGlwU21hbGxCb2FyZDEgPSBuZXcgU2hpcCgyKTtcbiAgICBzaGlwTWVkQm9hcmQxID0gbmV3IFNoaXAoMyk7XG4gICAgc2hpcExhcmdlQm9hcmQxID0gbmV3IFNoaXAoNCk7XG5cbiAgICBzaGlwU21hbGxCb2FyZDIgPSBuZXcgU2hpcCgyKTtcbiAgICBzaGlwTWVkQm9hcmQyID0gbmV3IFNoaXAoMyk7XG4gICAgc2hpcExhcmdlQm9hcmQyID0gbmV3IFNoaXAoNCk7XG5cbiAgICBwbGFjZVNoaXBzKCk7XG5cbiAgICByZWZyZXNoR2FtZUJvYXJkKHBsYXllckJvYXJkLCB0cnVlKTtcbiAgICByZWZyZXNoR2FtZUJvYXJkKGNvbXB1dGVyQm9hcmQsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gcmVmcmVzaEdhbWVCb2FyZChib2FyZCwgaXNQbGF5ZXIpIHtcbiAgICBsZXQgYm9hcmREaXY7XG5cbiAgICBpZiAoaXNQbGF5ZXIpIHtcbiAgICAgICAgYm9hcmREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BsYXllci1ib2FyZFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBib2FyZERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29tcHV0ZXItYm9hcmRcIik7XG4gICAgfVxuXG4gICAgYm9hcmREaXYuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGdyaWRTcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgICAgICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5hZGQoXCJncmlkU3F1YXJlXCIpO1xuICAgICAgICAgICAgZ3JpZFNxdWFyZS5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcIndpZHRoOjQ4cHg7IGhlaWdodDo0OHB4XCIpO1xuICAgICAgICAgICAgZ3JpZFNxdWFyZS5pZCA9IGkudG9TdHJpbmcoKSArIGoudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgaWYoIWlzUGxheWVyKSB7XG4gICAgICAgICAgICAgICAgZ3JpZFNxdWFyZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcGxheWVyU2VuZEF0dGFjaywgZmFsc2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUT0RPIHRoaXMgaXMgbm90IGZ1bmN0aW9uYWwsIHRoaXMgZG9lcyBub3Qgd29ya1xuICAgICAgICAgICAgbGV0IGdyaWRDb250ZW50ID0gYm9hcmQuZ2V0R3JpZENvbnRlbnQoaSwgaik7XG4gICAgICAgICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5hZGQoZ3JpZENvbnRlbnQpO1xuICAgICAgICAgICAgaWYgKGdyaWRDb250ZW50ID09PSBcImdyaWQtbWlzc1wiKSB7XG4gICAgICAgICAgICAgICAgZ3JpZFNxdWFyZS50ZXh0Q29udGVudCA9IFwib1wiO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChncmlkQ29udGVudCA9PT0gXCJncmlkLXNoaXAtaGl0XCIpIHtcbiAgICAgICAgICAgICAgICBncmlkU3F1YXJlLnRleHRDb250ZW50ID0gXCJYXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJvYXJkRGl2LmFwcGVuZENoaWxkKGdyaWRTcXVhcmUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBwbGF5ZXJTZW5kQXR0YWNrKGV2ZW50KSB7XG4gICAgaWYgKGlzUGxheWVyVHVybikge1xuICAgICAgICBsZXQgY29vcmRzID0gZXZlbnQuY3VycmVudFRhcmdldC5pZDtcbiAgICAgICAgbGV0IHJvdyA9IGNvb3Jkcy5jaGFyQXQoMCk7XG4gICAgICAgIGxldCBjb2wgPSBjb29yZHMuY2hhckF0KDEpO1xuXG4gICAgICAgIGNvbXB1dGVyQm9hcmQucmVjZWl2ZUF0dGFjayhyb3csIGNvbCk7XG5cbiAgICAgICAgaWYgKGNvbXB1dGVyQm9hcmQuZ2V0R3JpZENvbnRlbnQocm93LCBjb2wpICE9PSBcImdyaWQtc2hpcC1oaXRcIikge1xuICAgICAgICAgICAgaXNQbGF5ZXJUdXJuID0gZmFsc2U7XG4gICAgICAgICAgICBjb21wdXRlclNlbmRBdHRhY2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlZnJlc2hHYW1lQm9hcmQoY29tcHV0ZXJCb2FyZCwgZmFsc2UpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY29tcHV0ZXJTZW5kQXR0YWNrKCkge1xuICAgIGxldCBncmlkQ29udGVudDtcbiAgICBkbyB7XG4gICAgICAgIGdyaWRDb250ZW50ID0gcGxheWVyMi5zZW5kUmFuZG9tQXR0YWNrKHBsYXllckJvYXJkKTtcbiAgICB9IHdoaWxlIChncmlkQ29udGVudCA9PT0gXCJncmlkLXNoaXAtaGl0XCIpO1xuXG4gICAgcmVmcmVzaEdhbWVCb2FyZChwbGF5ZXJCb2FyZCwgdHJ1ZSk7XG5cbiAgICBpc1BsYXllclR1cm4gPSB0cnVlO1xufVxuXG5mdW5jdGlvbiBwbGFjZVNoaXBzKCkge1xuICAgIHBsYXllckJvYXJkLnBsYWNlU2hpcChzaGlwU21hbGxCb2FyZDEsIDAsIDApO1xuICAgIHBsYXllckJvYXJkLnBsYWNlU2hpcChzaGlwTWVkQm9hcmQxLCAwLCAyKTtcbiAgICBwbGF5ZXJCb2FyZC5wbGFjZVNoaXAoc2hpcExhcmdlQm9hcmQxLCAwLCA1KTtcblxuICAgIGNvbXB1dGVyQm9hcmQucGxhY2VTaGlwKHNoaXBTbWFsbEJvYXJkMiwgMCwgMCk7XG4gICAgY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoc2hpcE1lZEJvYXJkMiwgMCwgMik7XG4gICAgY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoc2hpcExhcmdlQm9hcmQyLCAwLCA1KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3RhcnRHYW1lO1xuIiwiY2xhc3MgUGxheWVyIHtcbiAgICBjb25zdHJ1Y3Rvcihpc1BsYXllcikge1xuICAgICAgICB0aGlzLmlzUGxheWVyID0gaXNQbGF5ZXI7XG4gICAgfVxuXG4gICAgc2VuZEF0dGFjayhib2FyZCwgcm93LCBjb2wpIHtcbiAgICAgICAgYm9hcmQucmVjZWl2ZUF0dGFjayhyb3csIGNvbCk7XG4gICAgfVxuXG4gICAgc2VuZFJhbmRvbUF0dGFjayhib2FyZCkge1xuICAgICAgICBsZXQgcm93ID0gdGhpcy5nZXRSYW5kb21JbnQoMTApO1xuICAgICAgICBsZXQgY29sID0gdGhpcy5nZXRSYW5kb21JbnQoMTApO1xuICAgICAgICBib2FyZC5yZWNlaXZlQXR0YWNrKHJvdywgY29sKTtcbiAgICAgICAgcmV0dXJuIGJvYXJkLmdldEdyaWRDb250ZW50KHJvdywgY29sKTtcbiAgICB9XG5cbiAgICBnZXRSYW5kb21JbnQobWF4KSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyOyIsImNsYXNzIFNoaXAge1xuICAgIGNvbnN0cnVjdG9yKHNpemUsIGlzVmVydGljYWwgPSB0cnVlLCBoaXRzID0gW10pIHtcbiAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcbiAgICAgICAgdGhpcy5pc1ZlcnRpY2FsID0gaXNWZXJ0aWNhbDtcbiAgICAgICAgdGhpcy5oaXRzID0gaGl0cztcbiAgICB9XG5cbiAgICBoaXQocG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy5oaXRzLnB1c2gocG9zaXRpb24pO1xuICAgIH1cblxuICAgIGlzU3VuaygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGl0cy5sZW5ndGggPT0gdGhpcy5zaXplO1xuICAgIH1cblxuICAgIC8vIFRPRE8gbmVlZCByZWZlcmVuY2UgdG8gc2hpcFxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwOyIsImltcG9ydCBzdGFydEdhbWUgZnJvbSBcIi4vZ2FtZS5qc1wiO1xuXG5mdW5jdGlvbiBpbml0aWFsaXplV2Vic2l0ZSgpIHtcbiAgICAvLyBUT0RPIGluaXRpYWwgRE9NIGNvbnRlbnQgY3JlYXRpb25cbiAgICBzdGFydEdhbWUoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaW5pdGlhbGl6ZVdlYnNpdGU7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgaW5pdGlhbGl6ZVdlYnNpdGUgZnJvbSBcIi4vd2Vic2l0ZVwiO1xuXG5pbml0aWFsaXplV2Vic2l0ZSgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9