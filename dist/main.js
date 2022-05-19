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

function startGame() {
    playerBoard = new _boardFactory__WEBPACK_IMPORTED_MODULE_0__["default"]();
    computerBoard = new _boardFactory__WEBPACK_IMPORTED_MODULE_0__["default"]();
    player1 = new _playerFactory__WEBPACK_IMPORTED_MODULE_1__["default"](true);
    player2 = new _playerFactory__WEBPACK_IMPORTED_MODULE_1__["default"](false);

    refreshGameBoard(playerBoard, true);
    refreshGameBoard(computerBoard, false);
}

function refreshGameBoard(board, isPlayer) {
    // display grid squares
    // const computerBoardDiv = document.getElementById("computer-board");

    let boardDiv;
    if (isPlayer) {
        boardDiv = document.querySelector("#player-board");
    } else {
        boardDiv = document.querySelector("#computer-board");
    }

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const gridSquare = document.createElement("div");

            gridSquare.classList.add("gridSquare");
            gridSquare.setAttribute("style", "width:48px; height:48px");
            gridSquare.id = i.toString() + j.toString();

            if(!isPlayer) {
                gridSquare.addEventListener("click", playerSendAttack, false)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBaUM7O0FBRWpDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4Qix1QkFBdUI7QUFDckQ7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsOEJBQThCLHFCQUFxQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsWUFBWTtBQUN0QztBQUNBLDhCQUE4QixZQUFZO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxLQUFLOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3hFZTtBQUNFO0FBQ0o7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLHFEQUFLO0FBQzNCLHdCQUF3QixxREFBSztBQUM3QixrQkFBa0Isc0RBQU07QUFDeEIsa0JBQWtCLHNEQUFNOztBQUV4QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBLG9CQUFvQixRQUFRO0FBQzVCLHdCQUF3QixRQUFRO0FBQ2hDOztBQUVBO0FBQ0EsMERBQTBEO0FBQzFEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLGlFQUFlLFNBQVMsRUFBQzs7Ozs7Ozs7Ozs7Ozs7O0FDekR6QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxNQUFNOzs7Ozs7Ozs7Ozs7OztBQ3BCckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpRUFBZSxJQUFJOzs7Ozs7Ozs7Ozs7Ozs7QUNsQmU7O0FBRWxDO0FBQ0E7QUFDQSxJQUFJLG9EQUFTO0FBQ2I7O0FBRUEsaUVBQWUsaUJBQWlCOzs7Ozs7VUNQaEM7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ04wQzs7QUFFMUMsb0RBQWlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9ib2FyZEZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVyRmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXBGYWN0b3J5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvd2Vic2l0ZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXBGYWN0b3J5JztcblxuY29uc3QgU0laRSA9IDEwO1xuXG5jbGFzcyBCb2FyZCB7ICAgIFxuICAgIGNvbnN0cnVjdG9yKGdyaWQgPSBbXSwgZ3JpZEhpdHMgPSBbXSkge1xuICAgICAgICB0aGlzLmdyaWQgPSBncmlkO1xuICAgICAgICB0aGlzLmdyaWRIaXRzID0gZ3JpZEhpdHM7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUoKSB7XG4gICAgICAgIC8vIGNyZWF0ZSBncmlkIGFuZCBtaXNzZWRTaG90c1xuICAgICAgICB0aGlzLmdyaWQgPSBBcnJheS5mcm9tKEFycmF5KFNJWkUpLCAoKSA9PiBuZXcgQXJyYXkoU0laRSkpO1xuICAgICAgICB0aGlzLmdyaWRIaXRzID0gQXJyYXkuZnJvbShBcnJheShTSVpFKSwgKCkgPT4gbmV3IEFycmF5KFNJWkUpKTtcbiAgICB9XG5cbiAgICBwbGFjZVNoaXAoc2hpcCwgcm93LCBjb2wpIHtcbiAgICAgICAgaWYoc2hpcC5pc1ZlcnRpY2FsKSB7XG4gICAgICAgICAgICAvLyBnbyBkb3duIGZyb20gc3RhcnQgcG9zXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gcm93OyBpIDwgKHNoaXAuc2l6ZSArIHJvdyk7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JpZFtpXVtjb2xdID0gc2hpcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YodGhpcy5ncmlkW3Jvd11bY29sXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBnbyByaWdodCBmcm9tIHN0YXJ0IHBvc1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IGNvbDsgaSA8IHNoaXAuc2l6ZSArIGNvbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ncmlkW3Jvd11baV0gPSBzaGlwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cblxuICAgIHJlY2VpdmVBdHRhY2socm93LCBjb2wpIHtcbiAgICAgICAgLy8gY2hlY2sgaWYgc2hpcCBpcyBhdCBjb29yZHNcbiAgICAgICAgLy8gaWYgdHJ1ZSwgc2VuZCBoaXQgdG8gc2hpcFxuICAgICAgICAvLyBpZiBmYWxzZSwgcmVjb3JkIGNvb3JkcyBvZiBtaXNzXG4gICAgICAgIC8vIFRPRE8gY2hlY2sgaWYgc3F1YXJlIGhhcyBhbHJlYWR5IGJlZW4gc2hvdFxuICAgICAgICBpZiAodGhpcy5ncmlkSGl0c1tyb3ddW2NvbF0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNxdWFyZSBoYXMgYWxyZWFkeSBiZWVuIHNob3RcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmdyaWRbcm93XVtjb2xdID09PSBcIm9iamVjdFwiICYmIHRoaXMuZ3JpZFtyb3ddW2NvbF0gIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZFtyb3ddW2NvbF0uaGl0KDEpO1xuICAgICAgICAgICAgdGhpcy5ncmlkSGl0c1tyb3ddW2NvbF0gPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdyaWRIaXRzW3Jvd11bY29sXSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc01pc3NlZFNob3Qocm93LCBjb2wpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZEhpdHNbcm93XVtjb2xdXG4gICAgICAgICAgICAmJiB0eXBlb2YgdGhpcy5ncmlkW3Jvd11bY29sXSAhPT0gXCJvYmplY3RcIjtcbiAgICB9XG5cbiAgICBoYXNBbGxTaGlwc1N1bmsoKSB7XG4gICAgICAgIC8vIFRPRE8gZW5zdXJlIHRoZXJlIGFyZSBzaGlwcyBvbiB0aGUgYm9hcmQgaWYgbmVjZXNzYXJ5XG4gICAgICAgIC8vIHJvd1xuICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBTSVpFOyByb3crKykge1xuICAgICAgICAgICAgLy8gY29sXG4gICAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBTSVpFOyBjb2wrKykge1xuICAgICAgICAgICAgICAgIC8vIGlmIHNoaXAgYW5kIG5vdCBoaXRcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgdGhpcy5ncmlkW3Jvd11bY29sXSA9PT0gXCJvYmplY3RcIiAmJiB0aGlzLmdyaWRbcm93XVtjb2xdICE9PSBudWxsICYmICF0aGlzLmdyaWRIaXRzW3Jvd11bY29sXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQm9hcmQ7IiwiaW1wb3J0IEJvYXJkIGZyb20gXCIuL2JvYXJkRmFjdG9yeVwiO1xuaW1wb3J0IFBsYXllciBmcm9tIFwiLi9wbGF5ZXJGYWN0b3J5XCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwRmFjdG9yeVwiO1xuXG5sZXQgcGxheWVyQm9hcmQ7XG5sZXQgY29tcHV0ZXJCb2FyZDtcbmxldCBwbGF5ZXIxO1xubGV0IHBsYXllcjI7XG5cbmZ1bmN0aW9uIHN0YXJ0R2FtZSgpIHtcbiAgICBwbGF5ZXJCb2FyZCA9IG5ldyBCb2FyZCgpO1xuICAgIGNvbXB1dGVyQm9hcmQgPSBuZXcgQm9hcmQoKTtcbiAgICBwbGF5ZXIxID0gbmV3IFBsYXllcih0cnVlKTtcbiAgICBwbGF5ZXIyID0gbmV3IFBsYXllcihmYWxzZSk7XG5cbiAgICByZWZyZXNoR2FtZUJvYXJkKHBsYXllckJvYXJkLCB0cnVlKTtcbiAgICByZWZyZXNoR2FtZUJvYXJkKGNvbXB1dGVyQm9hcmQsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gcmVmcmVzaEdhbWVCb2FyZChib2FyZCwgaXNQbGF5ZXIpIHtcbiAgICAvLyBkaXNwbGF5IGdyaWQgc3F1YXJlc1xuICAgIC8vIGNvbnN0IGNvbXB1dGVyQm9hcmREaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbXB1dGVyLWJvYXJkXCIpO1xuXG4gICAgbGV0IGJvYXJkRGl2O1xuICAgIGlmIChpc1BsYXllcikge1xuICAgICAgICBib2FyZERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGxheWVyLWJvYXJkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGJvYXJkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb21wdXRlci1ib2FyZFwiKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgICAgICBjb25zdCBncmlkU3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgICAgICAgICAgZ3JpZFNxdWFyZS5jbGFzc0xpc3QuYWRkKFwiZ3JpZFNxdWFyZVwiKTtcbiAgICAgICAgICAgIGdyaWRTcXVhcmUuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJ3aWR0aDo0OHB4OyBoZWlnaHQ6NDhweFwiKTtcbiAgICAgICAgICAgIGdyaWRTcXVhcmUuaWQgPSBpLnRvU3RyaW5nKCkgKyBqLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIGlmKCFpc1BsYXllcikge1xuICAgICAgICAgICAgICAgIGdyaWRTcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHBsYXllclNlbmRBdHRhY2ssIGZhbHNlKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBib2FyZERpdi5hcHBlbmRDaGlsZChncmlkU3F1YXJlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gcGxheWVyU2VuZEF0dGFjayhldmVudCkge1xuICAgIGxldCBjb29yZHMgPSBldmVudC5jdXJyZW50VGFyZ2V0LmlkO1xuICAgIGxldCByb3cgPSBjb29yZHMuY2hhckF0KDApO1xuICAgIGxldCBjb2wgPSBjb29yZHMuY2hhckF0KDEpO1xuXG4gICAgY29tcHV0ZXJCb2FyZC5yZWNlaXZlQXR0YWNrKHJvdywgY29sKTtcblxuICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQudGV4dENvbnRlbnQgPSBcIlhcIjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3RhcnRHYW1lO1xuIiwiY2xhc3MgUGxheWVyIHtcbiAgICBjb25zdHJ1Y3Rvcihpc1BsYXllcikge1xuICAgICAgICB0aGlzLmlzUGxheWVyID0gaXNQbGF5ZXI7XG4gICAgfVxuXG4gICAgc2VuZEF0dGFjayhib2FyZCwgcm93LCBjb2wpIHtcbiAgICAgICAgYm9hcmQucmVjZWl2ZUF0dGFjayhyb3csIGNvbCk7XG4gICAgfVxuXG4gICAgc2VuZFJhbmRvbUF0dGFjayhib2FyZCkge1xuICAgICAgICBsZXQgcm93ID0gdGhpcy5nZXRSYW5kb21JbnQoMTApO1xuICAgICAgICBsZXQgY29sID0gdGhpcy5nZXRSYW5kb21JbnQoMTApO1xuICAgICAgICBib2FyZC5yZWNlaXZlQXR0YWNrKHJvdywgY29sKTtcbiAgICB9XG5cbiAgICBnZXRSYW5kb21JbnQobWF4KSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyOyIsImNsYXNzIFNoaXAge1xuICAgIGNvbnN0cnVjdG9yKHNpemUsIGlzVmVydGljYWwgPSB0cnVlLCBoaXRzID0gW10pIHtcbiAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcbiAgICAgICAgdGhpcy5pc1ZlcnRpY2FsID0gaXNWZXJ0aWNhbDtcbiAgICAgICAgdGhpcy5oaXRzID0gaGl0cztcbiAgICB9XG5cbiAgICBoaXQocG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy5oaXRzLnB1c2gocG9zaXRpb24pO1xuICAgIH1cblxuICAgIGlzU3VuaygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGl0cy5sZW5ndGggPT0gdGhpcy5zaXplO1xuICAgIH1cblxuICAgIC8vIFRPRE8gbmVlZCByZWZlcmVuY2UgdG8gc2hpcFxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwOyIsImltcG9ydCBzdGFydEdhbWUgZnJvbSBcIi4vZ2FtZS5qc1wiO1xuXG5mdW5jdGlvbiBpbml0aWFsaXplV2Vic2l0ZSgpIHtcbiAgICAvLyBUT0RPIGluaXRpYWwgRE9NIGNvbnRlbnQgY3JlYXRpb25cbiAgICBzdGFydEdhbWUoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaW5pdGlhbGl6ZVdlYnNpdGU7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgaW5pdGlhbGl6ZVdlYnNpdGUgZnJvbSBcIi4vd2Vic2l0ZVwiO1xuXG5pbml0aWFsaXplV2Vic2l0ZSgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9