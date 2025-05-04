const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const startBtn = document.getElementById("mulai");
const backgroundMusic = document.getElementById("backgroundMusic");
const moveSound = document.getElementById("moveSound");
const musicSelect = document.getElementById("musicSelect");
const gameOverSound = document.getElementById("gameOverSound");

let playerPos = 130;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
highScoreDisplay.textContent = highScore;

let gameInterval, asteroidInterval, speedIncreaseInterval;
let asteroids = [];
let asteroidCount = 3;
let asteroidSpeed = 5;

let musicStarted = false;
let gameRunning = false;

// Set musik awal
backgroundMusic.volume = 0.5;
backgroundMusic.muted = false;
backgroundMusic.src = musicSelect.value;
backgroundMusic.load();

function updateRestartButton() {
  if (!gameRunning && score === 0) {
    startBtn.textContent = "Mulai!";
  } else if (gameRunning) {
    startBtn.textContent = "Berhenti!";
  } else {
    startBtn.textContent = "Main Lagi!";
  }
}
updateRestartButton();

// Ganti musik saat user pilih
musicSelect.addEventListener("change", function () {
  backgroundMusic.pause();
  backgroundMusic.src = this.value;
  backgroundMusic.load();

  if (gameRunning) {
    backgroundMusic
      .play()
      .catch((err) => console.warn("Gagal memutar musik:", err));
  }
});

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
  const pemainBawah = 410;

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
    backgroundMusic
      .play()
      .then(() => {
        console.log("Musik dimulai:", backgroundMusic.src);
      })
      .catch((err) => {
        console.warn("Gagal mulai musik:", err);
      });
    musicStarted = true;
  } else {
    backgroundMusic
      .play()
      .catch((err) => console.warn("Gagal lanjut musik:", err));
  }

  gameRunning = true;
  updateRestartButton();

  score = 0;
  playerPos = 130;
  asteroidSpeed = 5;
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
        asteroid.style.top = posisiAtas + asteroidSpeed + "px";
      } else {
        asteroid.style.top = "-40px";
        asteroid.style.left = Math.floor(Math.random() * 260) + "px";
      }

      if (cekTabrakan(asteroid)) {
        gameOver();
      }
    });
  }, 30);

  speedIncreaseInterval = setInterval(() => {
    asteroidSpeed += 0.5;
  }, 5000);
}

function stopGame() {
  backgroundMusic.pause();
  clearInterval(gameInterval);
  clearInterval(asteroidInterval);
  clearInterval(speedIncreaseInterval);
  gameRunning = false;
  updateRestartButton();
}

function gameOver() {
  stopGame();
  gameOverSound.currentTime = 0;
  gameOverSound.play();

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", score);
    highScoreDisplay.textContent = score;
  }

  alert("Upps, Game Over! Skor: " + score);
  updateRestartButton();
}

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

startBtn.addEventListener("click", () => {
  if (gameRunning) {
    stopGame();
  } else {
    startGame();
  }
});
