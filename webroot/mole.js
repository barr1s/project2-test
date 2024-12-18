let currentMoleTile;
let currentPlantTile;
let moleClickTimes = []; // To store reaction times for each mole click
let totalTime = 0; // Total time including penalties
let successfulClicks = 0; // Number of successful mole clicks
let gameOver = false;

let moleInterval; // Variable to store the mole interval
let plantInterval; // Variable to store the plant interval

// Get high score from localStorage
let highScore = localStorage.getItem("highScore") || null;

document.addEventListener("DOMContentLoaded", () => {
    setGame();
    updateHighScoreDisplay();
});

function setGame() {
    // Clear any existing intervals before starting new ones
    clearIntervals();

    document.getElementById("board").innerHTML = ""; // Clear the board
    document.getElementById("score").innerText = "Count: 0"; // Reset score display
    document.getElementById("timer").innerText = "0.000"; // Reset timer display
    gameOver = false;
    totalTime = 0;
    moleClickTimes = [];
    successfulClicks = 0;

    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }

    // Start intervals for mole and plant
    moleInterval = setInterval(setMole, 989);
    plantInterval = setInterval(setPlant, 1189);
}

function getRandomTile() {
    let num = Math.floor(Math.random() * 9);
    return num.toString();
}

function setMole() {
    if (gameOver) return;

    if (currentMoleTile && currentMoleTile.querySelector(".mole")) {
        currentMoleTile.innerHTML = ""; // Clear the previous mole
    }

    let mole = document.createElement("img");
    mole.src = "./images/monty-mole.png";
    mole.classList.add("mole");

    let num = getRandomTile();

    // Prevent mole from spawning on the same tile as a plant
    if (currentPlantTile && currentPlantTile.id === num) {
        return;
    }

    currentMoleTile = document.getElementById(num);
    currentMoleTile.appendChild(mole);

    mole.startTime = Date.now(); // Record the time mole appears
}

function setPlant() {
    if (gameOver) return;

    if (currentPlantTile && currentPlantTile.querySelector("img")) {
        currentPlantTile.innerHTML = ""; // Clear the previous plant
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
    if (gameOver) return;

    if (this === currentMoleTile) {
        const mole = currentMoleTile.querySelector(".mole");
        if (mole) {
            let reactionTime = Date.now() - mole.startTime; // Calculate reaction time
            moleClickTimes.push(reactionTime);
            totalTime += reactionTime / 1000; // Convert to seconds
            successfulClicks += 1;

            mole.src = "./images/pow.png";
            mole.classList.remove("mole");
            mole.classList.add("pow");
            setTimeout(() => {
                if (this.querySelector("img")?.src.includes("pow.png")) {
                    this.innerHTML = "";
                }
            }, 100);

            // Play the mole click sound
            new Audio('./sounds/hitmarker_2.mp3').play();

            document.getElementById("score").innerText = `Count: ${successfulClicks}`;
            if (successfulClicks === 10) {
                endGame();
            }

            // Update the live timer
            if (!gameOver) {
                updateTimer();
            }
        }
    } else if (this === currentPlantTile) {
        totalTime += 1; // Add a 1-second penalty

        // Play the plant click sound
        new Audio('./sounds/vine-boom.mp3').play();

        // Apply the "pow" effect to the plant
        const plant = currentPlantTile.querySelector("img");
        if (plant) {
            plant.src = "./images/pow.png";
            plant.classList.add("pow");
            setTimeout(() => {
                if (this.querySelector("img")?.src.includes("pow.png")) {
                    this.innerHTML = "";
                }
            }, 100);
        }

        // Update the live timer
        if (!gameOver) {
            updateTimer();
        }
    }
}

function updateTimer() {
    if (gameOver) return;

    // Update the timer display
    document.getElementById("timer").innerText = totalTime.toFixed(3);
}

function endGame() {
    gameOver = true;
    clearIntervals();

    // Final time calculation
    let finalTime = totalTime.toFixed(3); // Total time including penalties
    document.getElementById("score").innerText = `Final Time: ${finalTime} seconds`;

    // Check for high score and update if necessary
    if (!highScore || totalTime < highScore) {
        highScore = totalTime;
        localStorage.setItem("highScore", highScore.toFixed(3)); // Save the new high score
    }

    // Ensure no further updates to the timer
    document.getElementById("timer").innerText = finalTime;

    // Update high score display
    updateHighScoreDisplay();

    showTryAgainButton();
}

function updateHighScoreDisplay() {
    if (highScore) {
        document.getElementById("high-score").innerText = `Fastest Time: ${highScore} seconds`;
    } else {
        document.getElementById("high-score").innerText = "Fastest Time: N/A";
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
    const button = document.getElementById("try-again");
    if (button) {
        button.remove();
    }

    currentMoleTile = null;
    currentPlantTile = null;

    setGame();
}

function clearIntervals() {
    clearInterval(moleInterval);
    clearInterval(plantInterval);
}
