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
    // display grid squares
    // const computerBoardDiv = document.getElementById("computer-board");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBaUM7O0FBRWpDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4Qix1QkFBdUI7QUFDckQ7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsOEJBQThCLHFCQUFxQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsWUFBWTtBQUN0QztBQUNBLDhCQUE4QixZQUFZO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxLQUFLOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3hFZTtBQUNFO0FBQ0o7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBc0IscURBQUs7QUFDM0Isd0JBQXdCLHFEQUFLO0FBQzdCLGtCQUFrQixzREFBTTtBQUN4QixrQkFBa0Isc0RBQU07O0FBRXhCLDBCQUEwQixvREFBSTtBQUM5Qix3QkFBd0Isb0RBQUk7QUFDNUIsMEJBQTBCLG9EQUFJOztBQUU5QiwwQkFBMEIsb0RBQUk7QUFDOUIsd0JBQXdCLG9EQUFJO0FBQzVCLDBCQUEwQixvREFBSTs7QUFFOUI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTs7QUFFQSxvQkFBb0IsUUFBUTtBQUM1Qix3QkFBd0IsUUFBUTtBQUNoQzs7QUFFQTtBQUNBLDBEQUEwRDtBQUMxRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxTQUFTLEVBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ3pGekI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsTUFBTTs7Ozs7Ozs7Ozs7Ozs7QUNwQnJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUVBQWUsSUFBSTs7Ozs7Ozs7Ozs7Ozs7O0FDbEJlOztBQUVsQztBQUNBO0FBQ0EsSUFBSSxvREFBUztBQUNiOztBQUVBLGlFQUFlLGlCQUFpQjs7Ozs7O1VDUGhDO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOMEM7O0FBRTFDLG9EQUFpQiIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvYm9hcmRGYWN0b3J5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllckZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwRmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3dlYnNpdGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNoaXAgZnJvbSAnLi9zaGlwRmFjdG9yeSc7XG5cbmNvbnN0IFNJWkUgPSAxMDtcblxuY2xhc3MgQm9hcmQgeyAgICBcbiAgICBjb25zdHJ1Y3RvcihncmlkID0gW10sIGdyaWRIaXRzID0gW10pIHtcbiAgICAgICAgdGhpcy5ncmlkID0gZ3JpZDtcbiAgICAgICAgdGhpcy5ncmlkSGl0cyA9IGdyaWRIaXRzO1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKCkge1xuICAgICAgICAvLyBjcmVhdGUgZ3JpZCBhbmQgbWlzc2VkU2hvdHNcbiAgICAgICAgdGhpcy5ncmlkID0gQXJyYXkuZnJvbShBcnJheShTSVpFKSwgKCkgPT4gbmV3IEFycmF5KFNJWkUpKTtcbiAgICAgICAgdGhpcy5ncmlkSGl0cyA9IEFycmF5LmZyb20oQXJyYXkoU0laRSksICgpID0+IG5ldyBBcnJheShTSVpFKSk7XG4gICAgfVxuXG4gICAgcGxhY2VTaGlwKHNoaXAsIHJvdywgY29sKSB7XG4gICAgICAgIGlmKHNoaXAuaXNWZXJ0aWNhbCkge1xuICAgICAgICAgICAgLy8gZ28gZG93biBmcm9tIHN0YXJ0IHBvc1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHJvdzsgaSA8IChzaGlwLnNpemUgKyByb3cpOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWRbaV1bY29sXSA9IHNoaXA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mKHRoaXMuZ3JpZFtyb3ddW2NvbF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZ28gcmlnaHQgZnJvbSBzdGFydCBwb3NcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBjb2w7IGkgPCBzaGlwLnNpemUgKyBjb2w7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JpZFtyb3ddW2ldID0gc2hpcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG5cbiAgICByZWNlaXZlQXR0YWNrKHJvdywgY29sKSB7XG4gICAgICAgIC8vIGNoZWNrIGlmIHNoaXAgaXMgYXQgY29vcmRzXG4gICAgICAgIC8vIGlmIHRydWUsIHNlbmQgaGl0IHRvIHNoaXBcbiAgICAgICAgLy8gaWYgZmFsc2UsIHJlY29yZCBjb29yZHMgb2YgbWlzc1xuICAgICAgICAvLyBUT0RPIGNoZWNrIGlmIHNxdWFyZSBoYXMgYWxyZWFkeSBiZWVuIHNob3RcbiAgICAgICAgaWYgKHRoaXMuZ3JpZEhpdHNbcm93XVtjb2xdKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcXVhcmUgaGFzIGFscmVhZHkgYmVlbiBzaG90XCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5ncmlkW3Jvd11bY29sXSA9PT0gXCJvYmplY3RcIiAmJiB0aGlzLmdyaWRbcm93XVtjb2xdICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmdyaWRbcm93XVtjb2xdLmhpdCgxKTtcbiAgICAgICAgICAgIHRoaXMuZ3JpZEhpdHNbcm93XVtjb2xdID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ncmlkSGl0c1tyb3ddW2NvbF0gPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNNaXNzZWRTaG90KHJvdywgY29sKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyaWRIaXRzW3Jvd11bY29sXVxuICAgICAgICAgICAgJiYgdHlwZW9mIHRoaXMuZ3JpZFtyb3ddW2NvbF0gIT09IFwib2JqZWN0XCI7XG4gICAgfVxuXG4gICAgaGFzQWxsU2hpcHNTdW5rKCkge1xuICAgICAgICAvLyBUT0RPIGVuc3VyZSB0aGVyZSBhcmUgc2hpcHMgb24gdGhlIGJvYXJkIGlmIG5lY2Vzc2FyeVxuICAgICAgICAvLyByb3dcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgU0laRTsgcm93KyspIHtcbiAgICAgICAgICAgIC8vIGNvbFxuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgU0laRTsgY29sKyspIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBzaGlwIGFuZCBub3QgaGl0XG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIHRoaXMuZ3JpZFtyb3ddW2NvbF0gPT09IFwib2JqZWN0XCIgJiYgdGhpcy5ncmlkW3Jvd11bY29sXSAhPT0gbnVsbCAmJiAhdGhpcy5ncmlkSGl0c1tyb3ddW2NvbF0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJvYXJkOyIsImltcG9ydCBCb2FyZCBmcm9tIFwiLi9ib2FyZEZhY3RvcnlcIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vcGxheWVyRmFjdG9yeVwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcEZhY3RvcnlcIjtcblxubGV0IHBsYXllckJvYXJkO1xubGV0IGNvbXB1dGVyQm9hcmQ7XG5sZXQgcGxheWVyMTtcbmxldCBwbGF5ZXIyO1xuXG5sZXQgc2hpcFNtYWxsQm9hcmQxO1xubGV0IHNoaXBNZWRCb2FyZDE7XG5sZXQgc2hpcExhcmdlQm9hcmQxO1xuXG5sZXQgc2hpcFNtYWxsQm9hcmQyO1xubGV0IHNoaXBNZWRCb2FyZDI7XG5sZXQgc2hpcExhcmdlQm9hcmQyO1xuXG5mdW5jdGlvbiBzdGFydEdhbWUoKSB7XG4gICAgcGxheWVyQm9hcmQgPSBuZXcgQm9hcmQoKTtcbiAgICBjb21wdXRlckJvYXJkID0gbmV3IEJvYXJkKCk7XG4gICAgcGxheWVyMSA9IG5ldyBQbGF5ZXIodHJ1ZSk7XG4gICAgcGxheWVyMiA9IG5ldyBQbGF5ZXIoZmFsc2UpO1xuXG4gICAgc2hpcFNtYWxsQm9hcmQxID0gbmV3IFNoaXAoMik7XG4gICAgc2hpcE1lZEJvYXJkMSA9IG5ldyBTaGlwKDMpO1xuICAgIHNoaXBMYXJnZUJvYXJkMSA9IG5ldyBTaGlwKDQpO1xuXG4gICAgc2hpcFNtYWxsQm9hcmQyID0gbmV3IFNoaXAoMik7XG4gICAgc2hpcE1lZEJvYXJkMiA9IG5ldyBTaGlwKDMpO1xuICAgIHNoaXBMYXJnZUJvYXJkMiA9IG5ldyBTaGlwKDQpO1xuXG4gICAgcGxhY2VTaGlwcygpO1xuXG4gICAgcmVmcmVzaEdhbWVCb2FyZChwbGF5ZXJCb2FyZCwgdHJ1ZSk7XG4gICAgcmVmcmVzaEdhbWVCb2FyZChjb21wdXRlckJvYXJkLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIHJlZnJlc2hHYW1lQm9hcmQoYm9hcmQsIGlzUGxheWVyKSB7XG4gICAgLy8gZGlzcGxheSBncmlkIHNxdWFyZXNcbiAgICAvLyBjb25zdCBjb21wdXRlckJvYXJkRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21wdXRlci1ib2FyZFwiKTtcblxuICAgIGxldCBib2FyZERpdjtcbiAgICBpZiAoaXNQbGF5ZXIpIHtcbiAgICAgICAgYm9hcmREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BsYXllci1ib2FyZFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBib2FyZERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29tcHV0ZXItYm9hcmRcIik7XG4gICAgfVxuXG4gICAgYm9hcmREaXYuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGdyaWRTcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgICAgICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5hZGQoXCJncmlkU3F1YXJlXCIpO1xuICAgICAgICAgICAgZ3JpZFNxdWFyZS5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcIndpZHRoOjQ4cHg7IGhlaWdodDo0OHB4XCIpO1xuICAgICAgICAgICAgZ3JpZFNxdWFyZS5pZCA9IGkudG9TdHJpbmcoKSArIGoudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgaWYoIWlzUGxheWVyKSB7XG4gICAgICAgICAgICAgICAgZ3JpZFNxdWFyZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcGxheWVyU2VuZEF0dGFjaywgZmFsc2UpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJvYXJkRGl2LmFwcGVuZENoaWxkKGdyaWRTcXVhcmUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBwbGF5ZXJTZW5kQXR0YWNrKGV2ZW50KSB7XG4gICAgbGV0IGNvb3JkcyA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuaWQ7XG4gICAgbGV0IHJvdyA9IGNvb3Jkcy5jaGFyQXQoMCk7XG4gICAgbGV0IGNvbCA9IGNvb3Jkcy5jaGFyQXQoMSk7XG5cbiAgICBjb21wdXRlckJvYXJkLnJlY2VpdmVBdHRhY2socm93LCBjb2wpO1xuXG4gICAgZXZlbnQuY3VycmVudFRhcmdldC50ZXh0Q29udGVudCA9IFwiWFwiO1xuXG4gICAgcmVmcmVzaEdhbWVCb2FyZChjb21wdXRlckJvYXJkKTtcbn1cblxuZnVuY3Rpb24gcGxhY2VTaGlwcygpIHtcbiAgICBwbGF5ZXJCb2FyZC5wbGFjZVNoaXAoc2hpcFNtYWxsQm9hcmQxLCAwLCAwKTtcbiAgICBwbGF5ZXJCb2FyZC5wbGFjZVNoaXAoc2hpcE1lZEJvYXJkMSwgMCwgMik7XG4gICAgcGxheWVyQm9hcmQucGxhY2VTaGlwKHNoaXBMYXJnZUJvYXJkMSwgMCwgNSk7XG5cbiAgICBjb21wdXRlckJvYXJkLnBsYWNlU2hpcChzaGlwU21hbGxCb2FyZDIsIDAsIDApO1xuICAgIGNvbXB1dGVyQm9hcmQucGxhY2VTaGlwKHNoaXBNZWRCb2FyZDIsIDAsIDIpO1xuICAgIGNvbXB1dGVyQm9hcmQucGxhY2VTaGlwKHNoaXBMYXJnZUJvYXJkMiwgMCwgNSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0YXJ0R2FtZTtcbiIsImNsYXNzIFBsYXllciB7XG4gICAgY29uc3RydWN0b3IoaXNQbGF5ZXIpIHtcbiAgICAgICAgdGhpcy5pc1BsYXllciA9IGlzUGxheWVyO1xuICAgIH1cblxuICAgIHNlbmRBdHRhY2soYm9hcmQsIHJvdywgY29sKSB7XG4gICAgICAgIGJvYXJkLnJlY2VpdmVBdHRhY2socm93LCBjb2wpO1xuICAgIH1cblxuICAgIHNlbmRSYW5kb21BdHRhY2soYm9hcmQpIHtcbiAgICAgICAgbGV0IHJvdyA9IHRoaXMuZ2V0UmFuZG9tSW50KDEwKTtcbiAgICAgICAgbGV0IGNvbCA9IHRoaXMuZ2V0UmFuZG9tSW50KDEwKTtcbiAgICAgICAgYm9hcmQucmVjZWl2ZUF0dGFjayhyb3csIGNvbCk7XG4gICAgfVxuXG4gICAgZ2V0UmFuZG9tSW50KG1heCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWF4KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjsiLCJjbGFzcyBTaGlwIHtcbiAgICBjb25zdHJ1Y3RvcihzaXplLCBpc1ZlcnRpY2FsID0gdHJ1ZSwgaGl0cyA9IFtdKSB7XG4gICAgICAgIHRoaXMuc2l6ZSA9IHNpemU7XG4gICAgICAgIHRoaXMuaXNWZXJ0aWNhbCA9IGlzVmVydGljYWw7XG4gICAgICAgIHRoaXMuaGl0cyA9IGhpdHM7XG4gICAgfVxuXG4gICAgaGl0KHBvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMuaGl0cy5wdXNoKHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBpc1N1bmsoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpdHMubGVuZ3RoID09IHRoaXMuc2l6ZTtcbiAgICB9XG5cbiAgICAvLyBUT0RPIG5lZWQgcmVmZXJlbmNlIHRvIHNoaXBcbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcDsiLCJpbXBvcnQgc3RhcnRHYW1lIGZyb20gXCIuL2dhbWUuanNcIjtcblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVdlYnNpdGUoKSB7XG4gICAgLy8gVE9ETyBpbml0aWFsIERPTSBjb250ZW50IGNyZWF0aW9uXG4gICAgc3RhcnRHYW1lKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGluaXRpYWxpemVXZWJzaXRlOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGluaXRpYWxpemVXZWJzaXRlIGZyb20gXCIuL3dlYnNpdGVcIjtcblxuaW5pdGlhbGl6ZVdlYnNpdGUoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==