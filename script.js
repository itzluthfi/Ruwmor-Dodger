const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const restartBtn = document.getElementById("restart");
const backgroundMusic = document.getElementById("backgroundMusic");
const moveSound = document.getElementById("moveSound");

let playerPos = 130;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
highScoreDisplay.textContent = highScore;

let gameInterval, asteroidInterval;
let asteroids = [];
const asteroidCount = 3;

let musicStarted = false;
let gameRunning = false; // Menyimpan status game

// Fungsi untuk mengupdate teks tombol
function updateRestartButton() {
  if (!gameRunning && score === 0) {
    restartBtn.textContent = "Mulai!";
  } else if (gameRunning) {
    backgroundMusic.play();
    restartBtn.textContent = "Berhenti!";
  } else {
    restartBtn.textContent = "Main Lagi!";
  }
}

// Panggil pertama kali untuk set teks awal
updateRestartButton();

function movePlayer(e) {
  if (e.key === "ArrowLeft" && playerPos > 0) {
    playerPos -= 10;
  } else if (e.key === "ArrowRight" && playerPos < 260) {
    playerPos += 10;
  }
  player.style.left = playerPos + "px";
}

function cekTabrakan(asteroid) {
  const pemainKiri = playerPos;
  const pemainKanan = playerPos + 40;
  const pemainAtas = 370;
  const pemainBawah = 400;

  const asteroidAtas = parseInt(asteroid.style.top);
  const asteroidKiri = parseInt(asteroid.style.left);
  const asteroidBawah = asteroidAtas + 40;
  const asteroidKanan = asteroidKiri + 40;

  const hitboxPemain = {
    kiri: pemainKiri + 4,
    kanan: pemainKanan - 4,
    atas: pemainAtas + 4,
    bawah: pemainBawah - 4,
  };

  const hitboxAsteroid = {
    kiri: asteroidKiri + 4,
    kanan: asteroidKanan - 4,
    atas: asteroidAtas + 4,
    bawah: asteroidBawah - 4,
  };

  return (
    hitboxPemain.kiri < hitboxAsteroid.kanan &&
    hitboxPemain.kanan > hitboxAsteroid.kiri &&
    hitboxPemain.atas < hitboxAsteroid.bawah &&
    hitboxPemain.bawah > hitboxAsteroid.atas
  );
}

function startGame() {
  if (!musicStarted) {
    backgroundMusic.play();
    musicStarted = true;
  }

  gameRunning = true;
  updateRestartButton();

  score = 0;
  playerPos = 130;
  player.style.left = playerPos + "px";
  scoreDisplay.textContent = score;

  asteroids.forEach((a) => a.remove());
  asteroids = [];

  for (let i = 0; i < asteroidCount; i++) {
    const asteroidBaru = document.createElement("img");
    asteroidBaru.src = "img/asteroid.png";
    asteroidBaru.classList.add("asteroid");
    asteroidBaru.style.top = `${-Math.random() * 400}px`;
    asteroidBaru.style.left = `${Math.floor(Math.random() * 260)}px`;
    document.querySelector(".game-area").appendChild(asteroidBaru);
    asteroids.push(asteroidBaru);
  }

  gameInterval = setInterval(() => {
    score++;
    scoreDisplay.textContent = score;
  }, 100);

  asteroidInterval = setInterval(() => {
    asteroids.forEach((asteroid) => {
      let posisiAtas = parseInt(asteroid.style.top);

      if (posisiAtas < 400) {
        asteroid.style.top = posisiAtas + 5 + "px";
      } else {
        asteroid.style.top = "-40px";
        asteroid.style.left = Math.floor(Math.random() * 260) + "px";
      }

      if (cekTabrakan(asteroid)) {
        gameOver();
      }
    });
  }, 30);
}

function stopGame() {
  backgroundMusic.pause();
  clearInterval(gameInterval);
  clearInterval(asteroidInterval);
  gameRunning = false;
  updateRestartButton();
}

function gameOver() {
  stopGame();

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", score);
    highScoreDisplay.textContent = score;
  }

  alert("Game Over! Skor: " + score);
  updateRestartButton();
}

// Event listeners
document.addEventListener("keydown", movePlayer);

document.getElementById("leftBtn").addEventListener("click", () => {
  if (playerPos > 0) {
    playerPos -= 10;
    player.style.left = playerPos + "px";
    moveSound.currentTime = 0;
    moveSound.play();
  }
});

document.getElementById("rightBtn").addEventListener("click", () => {
  if (playerPos < 260) {
    playerPos += 10;
    player.style.left = playerPos + "px";
    moveSound.currentTime = 0;
    moveSound.play();
  }
});

restartBtn.addEventListener("click", () => {
  if (gameRunning) {
    stopGame();
  } else {
    startGame();
  }
});
