let currentMoleTile;
let currentPlantTile;
let score = 0;
let gameOver = false;

let moleInterval; // Variable to store the mole interval
let plantInterval; // Variable to store the plant interval

document.addEventListener("DOMContentLoaded", () => {
    setGame();
});

function setGame() {
    // Clear any existing intervals before starting new ones
    clearIntervals();

    document.getElementById("board").innerHTML = ""; // Clear the board
    document.getElementById("score").innerText = score.toString(); // Reset score display
    gameOver = false;
    score = 0;

    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }

    // Start new intervals
    moleInterval = setInterval(setMole, 1100);
    plantInterval = setInterval(setPlant, 1900);
}

function getRandomTile() {
    let num = Math.floor(Math.random() * 9);
    return num.toString();
}

function setMole() {
    if (gameOver) {
        return;
    }

    if (currentMoleTile && currentMoleTile.querySelector(".mole")) {
        currentMoleTile.innerHTML = "";
    }

    let mole = document.createElement("img");
    mole.src = "./images/monty-mole.png";
    mole.classList.add("mole");

    let num = getRandomTile();
    if (currentPlantTile && currentPlantTile.id === num) {
        return;
    }
    currentMoleTile = document.getElementById(num);
    currentMoleTile.appendChild(mole);
}

function setPlant() {
    if (gameOver) {
        return;
    }

    if (currentPlantTile && currentPlantTile.querySelector("img")) {
        currentPlantTile.innerHTML = "";
    }

    let plant = document.createElement("img");
    plant.src = "./images/piranha-plant.png";

    let num = getRandomTile();
    if (currentMoleTile && currentMoleTile.id === num) {
        return;
    }
    currentPlantTile = document.getElementById(num);
    currentPlantTile.appendChild(plant);
}

function selectTile() {
    if (gameOver) {
        return;
    }

    // If clicking on the Monty Mole
    if (this === currentMoleTile) {
        const mole = currentMoleTile.querySelector(".mole");
        if (mole) {
            mole.src = "./images/pow.png"; // Change image to pow.png
            mole.classList.remove("mole"); // Remove the mole class to prevent conflicts with spawning
            setTimeout(() => {
                if (this.querySelector("img")?.src.includes("pow.png")) {
                    this.innerHTML = "";
                }
            }, 500);
        }

        score += 1;
        document.getElementById("score").innerText = score.toString();
    }
    // If clicking on the Piranha Plant
    else if (this === currentPlantTile) {
        gameOver = true;
        document.getElementById("score").innerText = "GAME OVER: " + score.toString();
        showTryAgainButton();
    }
}

function showTryAgainButton() {
    const button = document.createElement("button");
    button.innerText = "Try Again";
    button.id = "try-again";
    button.style.marginTop = "10px";
    button.style.padding = "10px 20px";
    button.style.fontSize = "16px";

    button.addEventListener("click", resetGame);

    const container = document.getElementById("controls"); // Assume you have a div with id "controls"
    container.appendChild(button);
}

function resetGame() {
    // Remove the Try Again button
    const button = document.getElementById("try-again");
    if (button) {
        button.remove();
    }

    // Reset game variables and UI
    score = 0;
    currentMoleTile = null;
    currentPlantTile = null;

    setGame();
}

function clearIntervals() {
    // Clear the existing intervals
    clearInterval(moleInterval);
    clearInterval(plantInterval);
}
