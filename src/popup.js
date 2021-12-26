"use strict";

export default class PopUp {
    // 초기화 작업
    constructor() {
        this.popUp = document.querySelector(".pop-up");
        this.popUpText = document.querySelector(".pop-up__message");
        this.restart = document.querySelector(".pop-up__refresh");
        this.restart.addEventListener("click", () => {
            // 등록된 onClick 함수가 있으면 true이기 때문에 뒤에 onClick을 호출한다.
            this.onClick && this.onClick();
            hide();
        });
    }

    setClickListener(onClick) {
        this.onClick = onClick;
    }

    showWithText(text) {
        this.popUpText.innerText = text;
        this.popUp.classList.remove("pop-up--hide");
    }

    hide() {
        this.popUp.classList.add("pop-up--hide");
    }
}
