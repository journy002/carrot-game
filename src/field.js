"use strict";

const CARROT_SIZE = 80;
const carrotSound = new Audio("./sound/carrot_pull.mp3");

export default class Field {
    constructor(carrotCount, bugCount) {
        this.carrotCount = carrotCount;
        this.bugCount = bugCount;

        this.field = document.querySelector(".game__field");
        this.fieldRect = this.field.getBoundingClientRect();
        this.field.addEventListener("click", this.onClick);
    }

    // Field는 아이템을 생성하고 클릭까지 하는 영역이다.
    init() {
        this.field.innerHTML = "";
        this._addItem("carrot", this.carrotCount, "./img/carrot.png");
        this._addItem("bug", this.bugCount, "./img/bug.png");
    }

    setClickListener(onItemClick) {
        this.onItemClick = onItemClick;
    }

    // js는 타입스크립트 처럼 프라이빗 멤버변수를 만들 수 없기 때문에 '_'를 이용해서 외부에서 사용되면 안된다 라고 알려줍니다.(오래된 방법)
    _addItem(className, count, imgPath) {
        const x1 = 0;
        const y1 = 0;
        // img는 x,y축의 랜덤 값을 받아 position을 통해 자리를 잡는다.
        // game__field 제일 하단에 자리를 잡을 경우 (x,y)축 기준에서 이미지의 크기 만큼 자리를 잡기 때문에
        // fieldRect.width(height)에서 사이즈가 가장 큰 당근 이미지의 크기 만큼 빼줘야 필드 밖으로 벗어나는 상황을 직면하지 않는다.
        const x2 = this.fieldRect.width - CARROT_SIZE;
        const y2 = this.fieldRect.height - CARROT_SIZE;

        for (let i = 0; i < count; i++) {
            const item = document.createElement("img");
            item.setAttribute("class", className);
            item.setAttribute("src", imgPath);
            item.style.position = "absolute";
            const x = randomNumber(x1, x2);
            const y = randomNumber(y1, y2);

            item.style.left = `${x}px`;
            item.style.top = `${y}px`;
            this.field.appendChild(item);
        }
    }

    onClick(event) {
        const target = event.target;
        // matches('') css 셀렉터가 해당하는지 확인합니다.
        if (target.matches(".carrot")) {
            // 당근
            target.remove();
            playSound(carrotSound);
            this.onItemClick && this.onItemClick("carrot");
            // field는 스코어와 관련된 내용을 알지 못하기 때문에 전부 지워줍니다.
        } else if (target.matches(".bug")) {
            // 벌레
            this.onItemClick && this.onItemClick("bug");
        }
    }
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}
