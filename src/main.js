"use strict";
import Popup from "./popup.js";

const CARROT_SIZE = 80;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME__DURATION_SEC = 10;

const field = document.querySelector(".game__field");
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector(".game__button");
const gameTimer = document.querySelector(".game__timer");
const gameScore = document.querySelector(".game__score");

const bgSound = new Audio("./sound/bg.mp3");
const alertSound = new Audio("./sound/alert.wav");
const carrotSound = new Audio("./sound/carrot_pull.mp3");
const bugSound = new Audio("./sound/bug_pull.mp3");
const winSound = new Audio("./sound/game_win.mp3");

let started = false;
let score = 0;
let timer = undefined; // timer가 시적되면 타이머가 시간을 기억하고 있어야 합니다.

// Popup 생성자 사용하여 팝업 만들기
const gameFinishiBanner = new Popup();
gameFinishiBanner.setClickListener(() => {
    startGame();
});

// (e) => onFieldClick(event); = onFieldClick; 생략버전
field.addEventListener("click", onFieldClick);

gameBtn.addEventListener("click", () => {
    if (started) {
        stopGame();
    } else {
        startGame();
    }
    // started = !started; 처음엔 여기에 적어줬지만 재시작을 위해 startGame함수와 stopGame 함수에 각각 started의 상태를 적어주는게 좋다.
});

function startGame() {
    started = true;
    initGame();
    showStopButton();
    showTimerAndScore();
    startGameTimer();
    playSound(bgSound);
}

function stopGame() {
    started = false;
    stopGameTimer();
    hideGameButton();
    gameFinishiBanner.showWithText("REPLAY??");
    // showPopUpWithText("REPLAY?"); popup.js에 팝업텍스트 관련 맴버함수를 만들어줬기 때문에 지워준다.
    playSound(alertSound);
    stopSound(bgSound);
    // showPlayButton();
    // stopGameTimer();
}

function finishGame(win) {
    started = false;
    hideGameButton();
    if (win) {
        playSound(winSound);
    } else {
        playSound(bugSound);
    }
    stopGameTimer();
    stopSound(bgSound);

    gameFinishiBanner.showWithText(win ? "YOU WON!!" : "YOU LOST!!");
    // showPopUpWithText(win ? "YOU WON!" : "YOU LOST!");
}

// replay btn 클릭 이벤트
// restart.addEventListener("click", () => {
//     if (started) {
//         stopGame();
//     } else {
//         startGame();
//     }
//     started = !started;
//     console.log(started);
// });

// popup.js에 새로 추가(리펙토링)
// restart.addEventListener("click", () => {
//     startGame();
//     hidePopUp();
// });

// popup.js hide 함수에 새로 추가(리펙토링)
// function hidePopUp() {
//     popUp.classList.add("pop-up--hide");
// }

function startGameTimer() {
    let remainingTimeSec = GAME__DURATION_SEC;
    updateTimerText(remainingTimeSec);
    timer = setInterval(() => {
        if (remainingTimeSec <= 0) {
            clearInterval(timer);
            finishGame(CARROT_COUNT === score);
            return;
        }
        updateTimerText(--remainingTimeSec);
    }, 1000);
    // popUp.classList.add("pop-up--hide");
}

function stopGameTimer() {
    clearInterval(timer);
}

// function stopGameTimer() {
//     timer = clearInterval(timer);
//     popUp.classList.remove("pop-up--hide");
// }

function updateTimerText(time) {
    const minutes = Math.floor(time / 60); // Math.floor을 이용해 소수점 자리는 떨어지도록 해준다.
    const seconds = time % 60;
    gameTimer.innerText = `${minutes}:${seconds}`;
}

// function showPopUpWithText(text) {
//     popUpText.innerText = text;
//     popUp.classList.remove("pop-up--hide");
// }

function timeCount() {
    let time = 5;
    let sec = "";
    let x = setInterval(function () {
        sec = parseInt(time % 60);
        gameTimer.innerHTML = sec;
        time--;

        if (sec < 1) {
            clearInterval(x); // setInterval() 종료
            gameTimer.innerHTML = "초과";
        }
    }, 1000);
}

function showPlayButton() {
    const icon = gameBtn.querySelector(".fa-stop");
    icon.classList.add("fa-play");
    icon.classList.remove("fa-stop");
}

function showStopButton() {
    const icon = gameBtn.querySelector(".fas");
    icon.classList.add("fa-stop");
    icon.classList.remove("fa-play");
    gameBtn.style.visibility = "visible";
}

function hideGameButton() {
    gameBtn.style.visibility = "hidden";
}

function showTimerAndScore() {
    gameTimer.style.visibility = "visible";
    gameScore.style.visibility = "visible";
}

function initGame() {
    score = 0;
    field.innerHTML = "";
    gameScore.innerText = CARROT_COUNT;
    // 벌레와 당근을 생선한뒤 field에 추가해줍니다.
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

function onFieldClick(event) {
    if (!started) {
        return;
    }
    const target = event.target;
    // matches('') css 셀렉터가 해당하는지 확인합니다.
    if (target.matches(".carrot")) {
        // 당근
        target.remove();
        score++;
        playSound(carrotSound);
        updateScoreBoard();
        if (score === CARROT_COUNT) {
            finishGame(true);
        }
    } else if (target.matches(".bug")) {
        // 벌레
        finishGame(false);
    }
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

function stopSound(sound) {
    sound.pause();
}

function updateScoreBoard() {
    gameScore.innerText = CARROT_COUNT - score;
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}
