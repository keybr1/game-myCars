const MAX_ENEMY = 8;
const HEIGHT_ELEM = 100;

const score = document.querySelector(".score"),
  start = document.querySelector(".start"),
  gameArea = document.querySelector(".gameArea"),
  car = document.createElement("div"),
  topScore = document.getElementById("topScore");

const audio = document.createElement("embed");
audio.src = "./Night.mp3";
audio.style.cssText = `position: absolute; top: -HEIGHT_ELEM0px;`;

car.classList.add("car");

const countSection = Math.floor(
  document.documentElement.clientHeight / HEIGHT_ELEM
);
gameArea.style.height = countSection * HEIGHT_ELEM;

start.addEventListener("click", startGame);
document.addEventListener("keydown", startRun);
document.addEventListener("keyup", stopRun);

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

const setting = {
  start: false,
  score: 0,
  speed: 3,
  traffic: 3,
  level: 0,
};

let level = setting.level;

const result = parseInt(localStorage.getItem("nfjs_score", setting.score));

topScore.textContent = result ? result : 0;

const addLocalStorage = () => {
  if (result < setting.score) {
    localStorage.setItem("nfjs_score", setting.score);
    topScore.textContent = setting.score;
  }
};

function getQuanElements(heightElement) {
  return gameArea.offsetHeight / heightElement + 1;
}

function startGame(event) {
  const target = event.target;

  if (target === start) return;

  switch (target.id) {
    case "easy":
      setting.speed = 3;
      setting.traffic = 4;
      break;
    case "medium":
      setting.speed = 5;
      setting.traffic = 3;
      break;
    case "hard":
      setting.speed = 7;
      setting.traffic = 2;
      break;
  }

  start.classList.add("hide");
  gameArea.innerHTML = "";

  for (let i = 0; i < getQuanElements(HEIGHT_ELEM); i++) {
    const line = document.createElement("div");
    line.classList.add("line");
    line.style.top = `${i * HEIGHT_ELEM}px`;
    line.style.height = HEIGHT_ELEM / 2 + "px";
    line.y = i * HEIGHT_ELEM;
    gameArea.append(line);
  }

  for (let i = 0; i < getQuanElements(HEIGHT_ELEM * setting.traffic); i++) {
    const enemy = document.createElement("div");
    const randomEnemy = Math.floor(Math.random() * MAX_ENEMY) + 1;
    enemy.classList.add("enemy");
    const periodEnemy = -HEIGHT_ELEM * setting.traffic * (i + 1);
    enemy.y =
      periodEnemy < 100 ? -100 * setting.traffic * (i + 1) : periodEnemy;
    enemy.style.top = enemy.y + "px";
    enemy.style.background = `transparent url('./image/enemy${randomEnemy}.png') center / cover no-repeat`;
    gameArea.append(enemy);
    enemy.style.left =
      Math.floor(Math.random() * (gameArea.offsetWidth - enemy.offsetWidth)) +
      "px";
  }

  setting.start = true;
  setting.score = 0;
  gameArea.append(car);
  car.style.left = "125px";
  car.style.top = "auto";
  car.style.bottom = "10px";
  gameArea.append(audio);
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  if (setting.start) {
    setting.level = Math.floor(setting.score / 3000);

    if (setting.level !== level) {
      level = setting.level;
      setting.speed += 1;
    }

    setting.score += setting.speed;
    score.innerHTML = "SCORE<br>" + setting.score;
    moveRoad();
    moveEnemy();
    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }
    if (keys.ArrowRight && setting.x < gameArea.offsetWidth - car.offsetWidth) {
      setting.x += setting.speed;
    }
    if (
      keys.ArrowDown &&
      setting.y < gameArea.offsetHeight - car.offsetHeight
    ) {
      setting.y += setting.speed;
    }
    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }

    car.style.left = setting.x + "px";
    car.style.top = setting.y + "px";
    requestAnimationFrame(playGame);
  }
}

function startRun(event) {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    keys[event.key] = true;
  }
}

function stopRun(event) {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    keys[event.key] = false;
  }
}

function moveRoad() {
  let lines = document.querySelectorAll(".line");
  for (const line of lines) {
    line.y += setting.speed;
    line.style.top = line.y + "px";
    if (line.y >= gameArea.offsetHeight) {
      line.y = -HEIGHT_ELEM;
    }
  }
}

function moveEnemy() {
  let enemy = document.querySelectorAll(".enemy");

  enemy.forEach(function (item) {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();

    if (
      carRect.top <= enemyRect.bottom &&
      carRect.right >= enemyRect.left &&
      carRect.left + 5 <= enemyRect.right &&
      carRect.bottom >= enemyRect.top
    ) {
      setting.start = false;
      audio.remove();
      console.warn("DTP");
      start.classList.remove("hide");
      start.style.top = score.offsetHeight;
      addLocalStorage();
    }
    item.y += setting.speed / 2;
    item.style.top = item.y + "px";

    if (item.y >= gameArea.offsetHeight) {
      item.y = -HEIGHT_ELEM * setting.traffic;
      item.style.left =
        Math.floor(Math.random() * (gameArea.offsetWidth - item.offsetWidth)) +
        "px";
    }
  });
}
