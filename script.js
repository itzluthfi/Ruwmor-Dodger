const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const restartBtn = document.getElementById("restart");

let playerPos = 130;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
highScoreDisplay.textContent = highScore;

let gameInterval, asteroidInterval;
let asteroids = [];
const asteroidCount = 3; // Jumlah asteroid

function movePlayer(e) {
  if (e.key === "ArrowLeft" && playerPos > 0) {
    playerPos -= 10;
  } else if (e.key === "ArrowRight" && playerPos < 260) {
    playerPos += 10;
  }
  player.style.left = playerPos + "px";
}

function startGame() {
  score = 0;
  playerPos = 130;
  player.style.left = playerPos + "px";
  scoreDisplay.textContent = score;

  // Hapus asteroid lama
  asteroids.forEach((a) => a.remove());
  asteroids = [];

  // Buat asteroid baru
  for (let i = 0; i < asteroidCount; i++) {
    const newAsteroid = document.createElement("img");
    newAsteroid.src = "img/asteroid.png";
    newAsteroid.classList.add("asteroid");
    newAsteroid.style.top = `${-Math.random() * 400}px`;
    newAsteroid.style.left = `${Math.floor(Math.random() * 260)}px`;
    document.querySelector(".game-area").appendChild(newAsteroid);
    asteroids.push(newAsteroid);
  }

  gameInterval = setInterval(() => {
    score++;
    scoreDisplay.textContent = score;
  }, 100);

  asteroidInterval = setInterval(() => {
    asteroids.forEach((asteroid) => {
      let asteroidTop = parseInt(window.getComputedStyle(asteroid).top);
      let asteroidLeft = parseInt(window.getComputedStyle(asteroid).left);

      if (asteroidTop < 400) {
        asteroid.style.top = asteroidTop + 5 + "px";
      } else {
        asteroid.style.top = "-40px";
        asteroid.style.left = Math.floor(Math.random() * 260) + "px";
      }

      // Deteksi tabrakan
      const playerTop = 350;
      const playerBottom = 400;
      const asteroidBottom = asteroidTop + 40;

      if (
        asteroidBottom > playerTop &&
        asteroidTop < playerBottom &&
        asteroidLeft < playerPos + 40 &&
        asteroidLeft + 40 > playerPos
      ) {
        gameOver();
      }
    });
  }, 30);
}

function gameOver() {
  clearInterval(gameInterval);
  clearInterval(asteroidInterval);
  if (score > highScore) {
    localStorage.setItem("highScore", score);
    highScoreDisplay.textContent = score;
  }
  alert("Game Over! Skor: " + score);
}

// Keyboard
document.addEventListener("keydown", movePlayer);

// Tombol mobile
document.getElementById("leftBtn").addEventListener("click", () => {
  if (playerPos > 0) {
    playerPos -= 10;
    player.style.left = playerPos + "px";
  }
});

document.getElementById("rightBtn").addEventListener("click", () => {
  if (playerPos < 260) {
    playerPos += 10;
    player.style.left = playerPos + "px";
  }
});

// Restart
restartBtn.addEventListener("click", startGame);
