import startGame from "./game.js";

function initializeWebsite() {
    // TODO initial DOM content creation
    // startGame();
    const startBtn = document.createElement("button");
    startBtn.textContent = "Start Game";
    startBtn.addEventListener("click", startGame);

    const btnDiv = document.getElementById("btn-div");
    btnDiv.appendChild(startBtn);
}

export default initializeWebsite;