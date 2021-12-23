"use strict";
const CARROT_SIZE = 80;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;

const field = document.querySelector(".game__field");
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector(".game__button");
const gameTimer = document.querySelector(".game__timer");
const gameScore = document.querySelector(".game__score");

let started = false;
let score = 0;
let timer = undefined; // timer가 시적되면 타이머가 시간을 기억하고 있어야 합니다.

gameBtn.addEventListener("click", () => {
    if (started) {
        stopGame();
    } else {
        startGame();
    }
    started = !started;
    console.log(started);
});

function timeCount() {
    let time = 10;
    let sec = "";
    let x = setInterval(function () {
        sec = parseInt(time % 60);
        gameTimer.innerHTML = sec + "초";
        time--;
        if (sec < 1) {
            clearInterval(x); // setInterval() 종료
            gameTimer.innerHTML = "초과";
        }
    }, 1000);
}

function startGame() {
    initGame();
    showStopButton();
    showTimerAndScore();
    timeCount();
}

function stopGame() {
    showPlayButton();
}

function showPlayButton() {
    const icon = gameBtn.querySelector(".fa-stop");
    icon.classList.add("fa-play");
    icon.classList.remove("fa-stop");
}

function showStopButton() {
    const icon = gameBtn.querySelector(".fa-play");
    icon.classList.add("fa-stop");
    icon.classList.remove("fa-play");
}

function showTimerAndScore() {
    gameTimer.style.visibility = "visible";
    gameScore.style.visibility = "visible";
}

function initGame() {
    field.innerHTML = "";
    gameScore.innerText = CARROT_COUNT;
    // 벌레와 당근을 생선한뒤 field에 추가해줍니다.
    console.log(fieldRect);
    addItem("carrot", CARROT_COUNT, "./img/carrot.png");
    addItem("bug", BUG_COUNT, "./img/bug.png");
}

function addItem(className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;
    // img는 x,y축의 랜덤 값을 받아 position을 통해 자리를 잡는다.
    // game__field 제일 하단에 자리를 잡을 경우 (x,y)축 기준에서 이미지의 크기 만큼 자리를 잡기 때문에
    // fieldRect.width(height)에서 사이즈가 가장 큰 당근 이미지의 크기 만큼 빼줘야 필드 밖으로 벗어나는 상황을 직면하지 않는다.
    const x2 = fieldRect.width - CARROT_SIZE;
    const y2 = fieldRect.height - CARROT_SIZE;

    for (let i = 0; i < count; i++) {
        const item = document.createElement("img");
        item.setAttribute("class", className);
        item.setAttribute("src", imgPath);
        item.style.position = "absolute";
        const x = randomNumber(x1, x2);
        const y = randomNumber(y1, y2);

        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        field.appendChild(item);
    }
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}
