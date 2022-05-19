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
        // check if ship is at coords
        // if true, send hit to ship
        // if false, record coords of miss
        // TODO check if square has already been shot
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
        if (typeof this.grid[row][col] === "object") {
            return "grid-ship";
        } else if (typeof this.grid[row][col] === "object" && this.grid[row][col] !== null && this.gridHits[row][col]) {
            return "grid-ship-hit";
        } else if (this.gridHits[row][col]) {
            console.log("yeah this");
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

            // TODO show square content
            let gridContent = board.getGridContent(i, j);
            gridSquare.classList.add(gridContent);
            if (gridContent === ".grid-miss") {
                gridSquare.textContent = "X";
            }

            boardDiv.appendChild(gridSquare);
        }
    }
}

function playerSendAttack(event) {
    let coords = event.currentTarget.id;
    let row = coords.charAt(0);
    let col = coords.charAt(1);

    computerBoard.receiveAttack(row, col);

    event.currentTarget.textContent = "X";

    refreshGameBoard(computerBoard);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBaUM7O0FBRWpDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4Qix1QkFBdUI7QUFDckQ7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsOEJBQThCLHFCQUFxQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsWUFBWTtBQUN0QztBQUNBLDhCQUE4QixZQUFZO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlLEtBQUs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckZlO0FBQ0U7QUFDSjs7QUFFakM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQixxREFBSztBQUMzQix3QkFBd0IscURBQUs7QUFDN0Isa0JBQWtCLHNEQUFNO0FBQ3hCLGtCQUFrQixzREFBTTs7QUFFeEIsMEJBQTBCLG9EQUFJO0FBQzlCLHdCQUF3QixvREFBSTtBQUM1QiwwQkFBMEIsb0RBQUk7O0FBRTlCLDBCQUEwQixvREFBSTtBQUM5Qix3QkFBd0Isb0RBQUk7QUFDNUIsMEJBQTBCLG9EQUFJOztBQUU5Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7O0FBRUEsb0JBQW9CLFFBQVE7QUFDNUIsd0JBQXdCLFFBQVE7QUFDaEM7O0FBRUE7QUFDQSwwREFBMEQ7QUFDMUQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlLFNBQVMsRUFBQzs7Ozs7Ozs7Ozs7Ozs7O0FDOUZ6QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxNQUFNOzs7Ozs7Ozs7Ozs7OztBQ3BCckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpRUFBZSxJQUFJOzs7Ozs7Ozs7Ozs7Ozs7QUNsQmU7O0FBRWxDO0FBQ0E7QUFDQSxJQUFJLG9EQUFTO0FBQ2I7O0FBRUEsaUVBQWUsaUJBQWlCOzs7Ozs7VUNQaEM7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ04wQzs7QUFFMUMsb0RBQWlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9ib2FyZEZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVyRmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXBGYWN0b3J5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvd2Vic2l0ZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXBGYWN0b3J5JztcblxuY29uc3QgU0laRSA9IDEwO1xuXG5jbGFzcyBCb2FyZCB7ICAgIFxuICAgIGNvbnN0cnVjdG9yKGdyaWQgPSBbXSwgZ3JpZEhpdHMgPSBbXSkge1xuICAgICAgICB0aGlzLmdyaWQgPSBncmlkO1xuICAgICAgICB0aGlzLmdyaWRIaXRzID0gZ3JpZEhpdHM7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUoKSB7XG4gICAgICAgIC8vIGNyZWF0ZSBncmlkIGFuZCBtaXNzZWRTaG90c1xuICAgICAgICB0aGlzLmdyaWQgPSBBcnJheS5mcm9tKEFycmF5KFNJWkUpLCAoKSA9PiBuZXcgQXJyYXkoU0laRSkpO1xuICAgICAgICB0aGlzLmdyaWRIaXRzID0gQXJyYXkuZnJvbShBcnJheShTSVpFKSwgKCkgPT4gbmV3IEFycmF5KFNJWkUpKTtcbiAgICB9XG5cbiAgICBwbGFjZVNoaXAoc2hpcCwgcm93LCBjb2wpIHtcbiAgICAgICAgaWYoc2hpcC5pc1ZlcnRpY2FsKSB7XG4gICAgICAgICAgICAvLyBnbyBkb3duIGZyb20gc3RhcnQgcG9zXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gcm93OyBpIDwgKHNoaXAuc2l6ZSArIHJvdyk7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JpZFtpXVtjb2xdID0gc2hpcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YodGhpcy5ncmlkW3Jvd11bY29sXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBnbyByaWdodCBmcm9tIHN0YXJ0IHBvc1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IGNvbDsgaSA8IHNoaXAuc2l6ZSArIGNvbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ncmlkW3Jvd11baV0gPSBzaGlwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cblxuICAgIHJlY2VpdmVBdHRhY2socm93LCBjb2wpIHtcbiAgICAgICAgLy8gY2hlY2sgaWYgc2hpcCBpcyBhdCBjb29yZHNcbiAgICAgICAgLy8gaWYgdHJ1ZSwgc2VuZCBoaXQgdG8gc2hpcFxuICAgICAgICAvLyBpZiBmYWxzZSwgcmVjb3JkIGNvb3JkcyBvZiBtaXNzXG4gICAgICAgIC8vIFRPRE8gY2hlY2sgaWYgc3F1YXJlIGhhcyBhbHJlYWR5IGJlZW4gc2hvdFxuICAgICAgICBpZiAodGhpcy5ncmlkSGl0c1tyb3ddW2NvbF0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNxdWFyZSBoYXMgYWxyZWFkeSBiZWVuIHNob3RcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmdyaWRbcm93XVtjb2xdID09PSBcIm9iamVjdFwiICYmIHRoaXMuZ3JpZFtyb3ddW2NvbF0gIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZFtyb3ddW2NvbF0uaGl0KDEpO1xuICAgICAgICAgICAgdGhpcy5ncmlkSGl0c1tyb3ddW2NvbF0gPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdyaWRIaXRzW3Jvd11bY29sXSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc01pc3NlZFNob3Qocm93LCBjb2wpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZEhpdHNbcm93XVtjb2xdXG4gICAgICAgICAgICAmJiB0eXBlb2YgdGhpcy5ncmlkW3Jvd11bY29sXSAhPT0gXCJvYmplY3RcIjtcbiAgICB9XG5cbiAgICBoYXNBbGxTaGlwc1N1bmsoKSB7XG4gICAgICAgIC8vIFRPRE8gZW5zdXJlIHRoZXJlIGFyZSBzaGlwcyBvbiB0aGUgYm9hcmQgaWYgbmVjZXNzYXJ5XG4gICAgICAgIC8vIHJvd1xuICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBTSVpFOyByb3crKykge1xuICAgICAgICAgICAgLy8gY29sXG4gICAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBTSVpFOyBjb2wrKykge1xuICAgICAgICAgICAgICAgIC8vIGlmIHNoaXAgYW5kIG5vdCBoaXRcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgdGhpcy5ncmlkW3Jvd11bY29sXSA9PT0gXCJvYmplY3RcIiAmJiB0aGlzLmdyaWRbcm93XVtjb2xdICE9PSBudWxsICYmICF0aGlzLmdyaWRIaXRzW3Jvd11bY29sXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIDAgPSBlbXB0eSwgMSA9IHNoaXAsIDIgPSBtaXNzZWQgc2hvdCwgMyA9IHNoaXAgc2hvdFxuICAgIGdldEdyaWRDb250ZW50KHJvdywgY29sKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5ncmlkW3Jvd11bY29sXSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgcmV0dXJuIFwiZ3JpZC1zaGlwXCI7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuZ3JpZFtyb3ddW2NvbF0gPT09IFwib2JqZWN0XCIgJiYgdGhpcy5ncmlkW3Jvd11bY29sXSAhPT0gbnVsbCAmJiB0aGlzLmdyaWRIaXRzW3Jvd11bY29sXSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiZ3JpZC1zaGlwLWhpdFwiO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZ3JpZEhpdHNbcm93XVtjb2xdKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInllYWggdGhpc1wiKTtcbiAgICAgICAgICAgIHJldHVybiBcImdyaWQtbWlzc1wiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcImdyaWQtZW1wdHlcIjtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJvYXJkOyIsImltcG9ydCBCb2FyZCBmcm9tIFwiLi9ib2FyZEZhY3RvcnlcIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vcGxheWVyRmFjdG9yeVwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcEZhY3RvcnlcIjtcblxubGV0IHBsYXllckJvYXJkO1xubGV0IGNvbXB1dGVyQm9hcmQ7XG5sZXQgcGxheWVyMTtcbmxldCBwbGF5ZXIyO1xuXG5sZXQgc2hpcFNtYWxsQm9hcmQxO1xubGV0IHNoaXBNZWRCb2FyZDE7XG5sZXQgc2hpcExhcmdlQm9hcmQxO1xuXG5sZXQgc2hpcFNtYWxsQm9hcmQyO1xubGV0IHNoaXBNZWRCb2FyZDI7XG5sZXQgc2hpcExhcmdlQm9hcmQyO1xuXG5mdW5jdGlvbiBzdGFydEdhbWUoKSB7XG4gICAgcGxheWVyQm9hcmQgPSBuZXcgQm9hcmQoKTtcbiAgICBjb21wdXRlckJvYXJkID0gbmV3IEJvYXJkKCk7XG4gICAgcGxheWVyMSA9IG5ldyBQbGF5ZXIodHJ1ZSk7XG4gICAgcGxheWVyMiA9IG5ldyBQbGF5ZXIoZmFsc2UpO1xuXG4gICAgc2hpcFNtYWxsQm9hcmQxID0gbmV3IFNoaXAoMik7XG4gICAgc2hpcE1lZEJvYXJkMSA9IG5ldyBTaGlwKDMpO1xuICAgIHNoaXBMYXJnZUJvYXJkMSA9IG5ldyBTaGlwKDQpO1xuXG4gICAgc2hpcFNtYWxsQm9hcmQyID0gbmV3IFNoaXAoMik7XG4gICAgc2hpcE1lZEJvYXJkMiA9IG5ldyBTaGlwKDMpO1xuICAgIHNoaXBMYXJnZUJvYXJkMiA9IG5ldyBTaGlwKDQpO1xuXG4gICAgcGxhY2VTaGlwcygpO1xuXG4gICAgcmVmcmVzaEdhbWVCb2FyZChwbGF5ZXJCb2FyZCwgdHJ1ZSk7XG4gICAgcmVmcmVzaEdhbWVCb2FyZChjb21wdXRlckJvYXJkLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIHJlZnJlc2hHYW1lQm9hcmQoYm9hcmQsIGlzUGxheWVyKSB7XG4gICAgbGV0IGJvYXJkRGl2O1xuXG4gICAgaWYgKGlzUGxheWVyKSB7XG4gICAgICAgIGJvYXJkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwbGF5ZXItYm9hcmRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYm9hcmREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbXB1dGVyLWJvYXJkXCIpO1xuICAgIH1cblxuICAgIGJvYXJkRGl2LmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgICAgICBjb25zdCBncmlkU3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgICAgICAgICAgZ3JpZFNxdWFyZS5jbGFzc0xpc3QuYWRkKFwiZ3JpZFNxdWFyZVwiKTtcbiAgICAgICAgICAgIGdyaWRTcXVhcmUuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJ3aWR0aDo0OHB4OyBoZWlnaHQ6NDhweFwiKTtcbiAgICAgICAgICAgIGdyaWRTcXVhcmUuaWQgPSBpLnRvU3RyaW5nKCkgKyBqLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIGlmKCFpc1BsYXllcikge1xuICAgICAgICAgICAgICAgIGdyaWRTcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHBsYXllclNlbmRBdHRhY2ssIGZhbHNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVE9ETyBzaG93IHNxdWFyZSBjb250ZW50XG4gICAgICAgICAgICBsZXQgZ3JpZENvbnRlbnQgPSBib2FyZC5nZXRHcmlkQ29udGVudChpLCBqKTtcbiAgICAgICAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZChncmlkQ29udGVudCk7XG4gICAgICAgICAgICBpZiAoZ3JpZENvbnRlbnQgPT09IFwiLmdyaWQtbWlzc1wiKSB7XG4gICAgICAgICAgICAgICAgZ3JpZFNxdWFyZS50ZXh0Q29udGVudCA9IFwiWFwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBib2FyZERpdi5hcHBlbmRDaGlsZChncmlkU3F1YXJlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gcGxheWVyU2VuZEF0dGFjayhldmVudCkge1xuICAgIGxldCBjb29yZHMgPSBldmVudC5jdXJyZW50VGFyZ2V0LmlkO1xuICAgIGxldCByb3cgPSBjb29yZHMuY2hhckF0KDApO1xuICAgIGxldCBjb2wgPSBjb29yZHMuY2hhckF0KDEpO1xuXG4gICAgY29tcHV0ZXJCb2FyZC5yZWNlaXZlQXR0YWNrKHJvdywgY29sKTtcblxuICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQudGV4dENvbnRlbnQgPSBcIlhcIjtcblxuICAgIHJlZnJlc2hHYW1lQm9hcmQoY29tcHV0ZXJCb2FyZCk7XG59XG5cbmZ1bmN0aW9uIHBsYWNlU2hpcHMoKSB7XG4gICAgcGxheWVyQm9hcmQucGxhY2VTaGlwKHNoaXBTbWFsbEJvYXJkMSwgMCwgMCk7XG4gICAgcGxheWVyQm9hcmQucGxhY2VTaGlwKHNoaXBNZWRCb2FyZDEsIDAsIDIpO1xuICAgIHBsYXllckJvYXJkLnBsYWNlU2hpcChzaGlwTGFyZ2VCb2FyZDEsIDAsIDUpO1xuXG4gICAgY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoc2hpcFNtYWxsQm9hcmQyLCAwLCAwKTtcbiAgICBjb21wdXRlckJvYXJkLnBsYWNlU2hpcChzaGlwTWVkQm9hcmQyLCAwLCAyKTtcbiAgICBjb21wdXRlckJvYXJkLnBsYWNlU2hpcChzaGlwTGFyZ2VCb2FyZDIsIDAsIDUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFydEdhbWU7XG4iLCJjbGFzcyBQbGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKGlzUGxheWVyKSB7XG4gICAgICAgIHRoaXMuaXNQbGF5ZXIgPSBpc1BsYXllcjtcbiAgICB9XG5cbiAgICBzZW5kQXR0YWNrKGJvYXJkLCByb3csIGNvbCkge1xuICAgICAgICBib2FyZC5yZWNlaXZlQXR0YWNrKHJvdywgY29sKTtcbiAgICB9XG5cbiAgICBzZW5kUmFuZG9tQXR0YWNrKGJvYXJkKSB7XG4gICAgICAgIGxldCByb3cgPSB0aGlzLmdldFJhbmRvbUludCgxMCk7XG4gICAgICAgIGxldCBjb2wgPSB0aGlzLmdldFJhbmRvbUludCgxMCk7XG4gICAgICAgIGJvYXJkLnJlY2VpdmVBdHRhY2socm93LCBjb2wpO1xuICAgIH1cblxuICAgIGdldFJhbmRvbUludChtYXgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1heCk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7IiwiY2xhc3MgU2hpcCB7XG4gICAgY29uc3RydWN0b3Ioc2l6ZSwgaXNWZXJ0aWNhbCA9IHRydWUsIGhpdHMgPSBbXSkge1xuICAgICAgICB0aGlzLnNpemUgPSBzaXplO1xuICAgICAgICB0aGlzLmlzVmVydGljYWwgPSBpc1ZlcnRpY2FsO1xuICAgICAgICB0aGlzLmhpdHMgPSBoaXRzO1xuICAgIH1cblxuICAgIGhpdChwb3NpdGlvbikge1xuICAgICAgICB0aGlzLmhpdHMucHVzaChwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgaXNTdW5rKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oaXRzLmxlbmd0aCA9PSB0aGlzLnNpemU7XG4gICAgfVxuXG4gICAgLy8gVE9ETyBuZWVkIHJlZmVyZW5jZSB0byBzaGlwXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXA7IiwiaW1wb3J0IHN0YXJ0R2FtZSBmcm9tIFwiLi9nYW1lLmpzXCI7XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVXZWJzaXRlKCkge1xuICAgIC8vIFRPRE8gaW5pdGlhbCBET00gY29udGVudCBjcmVhdGlvblxuICAgIHN0YXJ0R2FtZSgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpbml0aWFsaXplV2Vic2l0ZTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBpbml0aWFsaXplV2Vic2l0ZSBmcm9tIFwiLi93ZWJzaXRlXCI7XG5cbmluaXRpYWxpemVXZWJzaXRlKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=