class ScrollEvent {
  constructor(win) {
    this.win = win;

  }

  // /**
  //  * スムーズスクロールと履歴を設定
  //  */
  // clickEvent = (e) => {
  //   e.preventDefault();
  //   const hash   = decodeURIComponent(e.currentTarget.hash);
  //   const target = scrollTopJs(doc.getElementById(hash.substr(1)))
  //     - ghFixedHeight + SCROLL.reactionTime;

  //   if (CAN_SMOOTH_SCROLL) {
  //     smoothScrollY(Math.min(target, scrollRange), SCROLL_TIME);

  //   } else {
  //     this.win.scrollTo(this.win.pageXOffset, target);

  //     if (CAN_RECORD_CLICK_HISTORY) this.win.history.pushState(null, hash, hash);

  //   }
  // }

  smoothScrollY(win) {

  }
}

export { ScrollEvent }
