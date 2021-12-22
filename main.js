"use strict";
const CARROT__SIZE = 80;
const field = document.querySelector(".game__field");
const fieldRect = field.getBoundingClientRect();

function initGame() {
    // 벌레와 당근을 생선한뒤 field에 추가해줍니다.
    console.log(fieldRect);
    addItem("carrot", 5, "./img/carrot.png");
    addItem("bug", 5, "./img/bug.png");
}

function addItem(className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;
    // img는 x,y축의 랜덤 값을 받아 position을 통해 자리를 잡는다.
    // game__field 제일 하단에 자리를 잡을 경우 (x,y)축 기준에서 이미지의 크기 만큼 자리를 잡기 때문에
    // fieldRect.width(height)에서 사이즈가 가장 큰 당근 이미지의 크기 만큼 빼줘야 필드 밖으로 벗어나는 상황을 직면하지 않는다.
    const x2 = fieldRect.width - CARROT__SIZE;
    const y2 = fieldRect.height - CARROT__SIZE;

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

initGame();
