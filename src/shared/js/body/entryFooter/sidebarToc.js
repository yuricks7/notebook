/**
 * 追尾する目次（ver3.3.0）
 *
 * 【参考】
 * はてなブログ向けのサイドバーで追尾する目次【ver3】 http://twilyze.hatenablog.jp/entry/sidebar-toc-3
 * https://gist.github.com/twilyze/30809fa76691983312dced621eb1040a
 */
const index = () => {
  "use strict";

  // -------------- ↓設定ここから↓ --------------
  const PAGE_CATEGORIES = [{
    class  : "page-entry",
    title  : "目次",
    display: true,
  }, {
    class  : "page-index",
    title  : "このページの記事一覧",
    display: true,
    canListUpPages: true,
  }, {
    class  : "page-archive",
    title  : "このカテゴリーの記事一覧",
    display: true,
    canListUpPages: true,
  }, {
    class  : "page-static_page",
    title  : "entry-title",
    display: false,
  }];

  // メディアクエリ
  const MEDIA_QUERY = {
    canSet        : false,
    queryToDisplay: "(min-width: 1138px)",
  };

  // モジュールのサイズ、位置
  const MODULE_SIZE = {
    marginTop   : 10,
    marginBottom: 50,
    maxHeight: 0, // モジュールのサイズ（0で設定off）
    fixedTop : 0, // "最終手段"
  };

  // 出力する見出し
  const HEADLINE = {
    tag    : "ol",
    min    : 1,
    sources: ["h3", "h4", "h5", "h6"],
  };

  // スクロール
  const SCROLL = {
    reactionTime:  10,
    timeForPc   : 200,
    timeForTouch: 200,
    canShowBarShadow: true,
  };

  // 追尾
  const FOLLOW = {
    switchPoint: 40, // 現在地を切り替えるポイント
    canScrollOverBottom: true,
    stop: {
      whenNoSideBar   : true,
      whenEntrySmaller: true,
    }
  }

  const CAN_LINK_MODULE_TITLE    = false;
  const CAN_RECORD_CLICK_HISTORY = true;

  // 待ち時間
  const DELAY = {
    canWaitDomLoad : true,
    afterDomLoaded :    0,
    afterPageLoaded: 1000,
  };

  // クリック
  const UPDATE_AFTER_CLICK = {
    selectors: [],
    delayTime: 2000,
  };

  // タッチ
  const TOUCH = {
    device   : "ontouchstart" in window,
    isDisable: false,
  };

  // その他
  const GLOBAL_HEADERS = ["#globalheader-container"]; // はてな仕様
  const IS_STICKY_MODE = false;

  // -------------- ↑設定ここまで↑ --------------

  // Define
  const win = window;
  const doc = document;

  const stocIds = {
    toc     : "stoc",
    module  : "stoc-module",
    title   : "stoc-title",
    body    : "stoc-body",
    guide   : "stoc-guide",
    subGuide: "stoc-sub-guide",
  };

  const classDefs = {
    moduleTitle: "hatena-module-title",
    entryTitle : "entry-title",
    entryLink  : "entry-title-link",
    fadeIn     : "fade-in",
    touch      : "touch",
    shadow     : "shadow",
    active     : "active",
    tracking   : "tracking",
    fixed      : "fixed",
    absolute   : "absolute",
  };

  const positions = {
    static  : "static",
    fixed   : "fixed",
    absolute: "absolute",
    sticky  : "sticky",
  };

  const heightProps = {
    margin  : [
      "marginTop",
      "marginBottom"
    ],
    padding: [
      "paddingTop",
      "borderTopWidth",
      "paddingBottom",
      "borderBottomWidth"
    ]
  };

  const SCROLL_TIME = TOUCH.device ? SCROLL.timeForTouch : SCROLL.timeForPc;
  const CAN_SMOOTH_SCROLL = SCROLL_TIME > 0 ? true : false;

  /*********************************************
   * 補助関数
   *********************************************/

  /**
   * 単位（px）を追加
   *
   * @param {number} num 数値
   *
   * @return {string} "●px"
   */
  const toPixel = (num) => {
    return `${num}px`;
  }

  /**
   * divブロックを追加
   *
   * @return {Element} 新しいElement
   */
  const addDiv = () => {
    return doc.createElement("div");
  }

  /**
   * HTML用の記号を除去
   *
   * @return {string} 除去後の文字列
   */
  const escapeHtml = (function () {

    return function (str) {
      if (typeof str !== "string") return str;

      const regex = /[&'"<>]/g; // タグ関係の記号
      return str.replace(regex, replaceSymbols());
    };
  })();

  const replaceSymbols = (match) => {
    const replaceObj = {
      "&": "&amp;",
      "'": "&#39;",
      '"': "&quot;",
      "<": "&lt;",
      ">": "&gt;",
    };

    return replaceObj[match];
  }

  /**
   * 簡易シングルトンなgetComputedStyle
   * （IDが設定されてない場合は毎回取得する）
   *
   * - `getComputedStyle`関数
   *
   *   `jQuery.css()`の代わり
   *
   * - **シングルトン**とは…
   *
   *   > 一言でいうと、生成するインスタンスの数を1つに制限するデザインパターンです。
   *   >
   *   > <cite>[デザインパターン「Singleton」 - Qiita](https://qiita.com/shoheiyokoyama/items/c16fd547a77773c0ccc1)</cite>
   */
  const getComputedStyleWithWrap = (function () {
    const data = {};
    return function (elem) {

      const id = hyphen2camel(elem.id);
      if (!data[id]) {
        console.assert(id, "No id：%o", elem);
        const style = getComputedStyle(elem, null);

        if (!id) return style;
        data[id] = style;
      }

      return data[id];
    };
  })();

  /**
   * 1文字目の記号からidかclass要素を取得する
   *
   * @param {string} idOrClass 要素の種類を表す文字列
   *
   * @return {Array} id要素かクラス要素の配列
   */
  function getElementsSelector(idOrClass) {
    const elems = [];
    const first = idOrClass.charAt(0);
    const name  = idOrClass.slice(1);

    switch (first) {
      case "#":
        elems[0] = doc.getElementById(name);
        break;

      case ".":
        elems = doc.getElementsByClassName(name);
        break;

      default:
        break;
    }

    return elems;
  }

  /**
   * 指定したスタイルを数値に変換して取得
   *
   * @param {Element} elem
   * @param {string}  styleName
   *
   * @return {number} 浮動小数点値
   */
  function style2FloatingNumber(elem, styleName) {
    const style = getComputedStyleWithWrap(elem)[styleName];
    const ret   = parseFloat(style);

    console.assert(!isNaN(ret), `${elem.id} [${styleName}] NaN`);
    return ret;
  }

  /**
   * 特定のクラスが設定されていない状態の値を取得
   *
   * @param {Element} elem
   * @param {Array} styleNames
   * @param {Array} srcClassNames
   *
   * @return {Array} 特定のクラスが設定されていない値の配列
   */
  function getFloatByNoClassElement(elem, styleNames, srcClassNames) {
    let ret = [];
    const classList = elem.classList;

    const existingClassNames = srcClassNames.filter(function (e) {
      return classList.contains(e);
    });

    existingClassNames.forEach(function (e) {
      classList.remove(e);
    });

    styleNames.forEach(function (e) {
      ret.push(style2FloatingNumber(elem, e));
    });

    existingClassNames.forEach(function (e) {
      classList.add(e);
    });

    return ret;
  }

  /**
   * ハイフン区切りからキャメルケースに変換
   *
   * @param {string} str 変換前
   *
   * @return {string} 変換後の文字列
   */
  function hyphen2camel(str) {
    return str.replace(/[-]./g, function (match) {
      return match.charAt(1).toUpperCase();
    });
  }

  /**
   * `$.outerHeight()`
   *
   * @param {Element} elem
   * @param {}        margin
   *
   * @return {number} ボックスの高さ
   */
  function outerHeightJs(elem, margin) {
    let ret = elem.offsetHeight;
    if (!margin) return ret;

    return ret += sumPropValues(elem, heightProps.margin);
  }

  /**
   * $.scrollTop()
   *
   * @param {Element} elem
   * @param {number}  scrollTop
   *
   * @return {number} スクロール位置
   */
  function scrollTopJs(elem, scrollTop) {
    const boundaryTop = elem.getBoundingClientRect().top;
    const offsetY     = (scrollTop !== void 0 ? scrollTop : win.pageYOffset); // 変数名が不適切かも…

    return boundaryTop + offsetY;
  }

  /**
   * 縦方向のスムーズスクロール
   */
  const smoothScrollY = (function () {
    const frameTime = 1000 / 30;
    const scrollTo  = win.scrollTo;
    const timer     = win.performance ? performance : Date;

    let requestId, request, cancel, existRAF;
    {
      const strRAF = "requestAnimationFrame";
      existRAF     = Object.prototype.hasOwnProperty.call(win, strRAF);
      if (existRAF) {
        request = win[strRAF];
        cancel  = win.cancelAnimationFrame;

      } else {
        request = win.setTimeout;
        cancel  = win.clearTimeout;
      }
    }

    /**
     * InOutQuadを容易にする(?)
     */
    const easeInOutQuad = (t) => {
      return (t < 0.5) ? (2 * t * t) : (-1 + (4 - 2 * t) * t);
    }

    return function (target, duration) {
      const startTime = timer.now();
      const startY = win.pageYOffset;
      const startX = win.pageXOffset;
      const distance = target - startY;
      let elapsedTime;

      cancel(requestId);
      requestId = request(existRAF ? step01 : step02);

      /**
       * requestAnimationFrame
       * （アロー関数にすると動かない模様…）
       */
      function step01(timestamp) {
        elapsedTime = timestamp - startTime;
        if (elapsedTime >= duration) {
          scrollTo(startX, target);
          return;
        }
        scrollTo(
          startX,
          easeInOutQuad(elapsedTime / duration) * distance + startY
        );
        requestId = request(step01);
      }

      /**
       * setTimeout
       */
      function step02() {
        elapsedTime = timer.now() - startTime;
        if (elapsedTime >= duration) {
          scrollTo(startX, target);
          return;
        }
        scrollTo(
          startX,
          easeInOutQuad(elapsedTime / duration) * distance + startY
        );
        requestId = request(step02, frameTime);
      }
    };
  })();

  /**
   * 指定したプロパティの数値を合計する
   *
   * @param {Element} elem
   * @param {Array}   props
   *
   * @return {number} 合計値
   */
  function sumPropValues(elem, props) {
    let ret = 0;
    const css = getComputedStyleWithWrap(elem);

    for (let i = 0, len = props.length; i < len; i++) {
      const num = parseFloat(css[props[i]]);
      if (isNaN(num)) continue;

      ret += num;
    }

    return ret;
  }

  /* =================================================== *
   * メイン
   * =================================================== */
  const main = () => {
    console.log(
      "%c---sidebar toc---  DELAY.afterDomLoaded:" + DELAY.afterDomLoaded,
      "color:blue"
    );
    console.time("sidebarToc add");

    // 目次モジュール
    const elmStoc = doc.getElementById(stocIds.toc);
    if (!elmStoc) {
      console.error("sidebarToc: 要素が見つかりません");
      return;
    }

    const elmSidebarModule     = elmStoc.parentNode.parentNode;
    const elmSidebarModuleBody = elmStoc.parentElement;
    const stySidebarModule     = elmSidebarModule.style;

    /*********************************************
     * ページの種類を判定
     *********************************************/
    let currentPage;
    const bodyClassList = doc.body.classList;
    for (let i = 0; i < PAGE_CATEGORIES.length; i++) {
      currentPage = PAGE_CATEGORIES[i];
      if (!bodyClassList.contains(currentPage.class)) continue;
      if (!currentPage.display) break;

      console.log("page:" + currentPage.class);
      break;
    }

    // 表示を不要と設定しているページは「非表示」にして処理終了
    if (!currentPage) {
      hideStoc();
      return; // 終了
    }

    /*********************************************
     * 
     *********************************************/
    const canListUpPages = currentPage.canListUpPages;
    const pageListTitle  = currentPage.title;
    const elmMainInner = doc.getElementById("main-inner");

    /*********************************************
     * 目次記法の目次にもスムーズスクロールを適用
     *********************************************/
    let hasTocOnBody = false;
    if (!canListUpPages) {
      const clsTocOnBody = "table-of-contents";
      const elmTocOnBody = elmMainInner.getElementsByClassName(clsTocOnBody)[0];

      if (elmTocOnBody) {
        const elmTocOnBodyAnchor = elmTocOnBody.getElementsByTagName("a");
        for (let i = 0; i < elmTocOnBodyAnchor.length; i++) {
          elmTocOnBodyAnchor[i].addEventListener("click", clickEvent, false);
          hasTocOnBody = true;
        }
      }
    }

    // タッチデバイスで動かさない設定の時は、「非表示」にして終了
    if (TOUCH.isDisable) {
      hideStoc();
      return;
    }

    /*********************************************
     * 表示する見出しの一覧を取得
     *********************************************/
    let elmContents     = [];
    let elmContentTexts = [];
    if (canListUpPages) {
      const classNames = ["hentry", "archive-entry"];
      for (let i = 0, len = classNames.length; i < len; i++) {
        elmContents = elmMainInner.getElementsByClassName(classNames[i]);
        if (elmContents.length > 1) break;
      }

      const elems = elmMainInner.getElementsByClassName(classDefs.entryLink);
      for (let i = 0, len = elems.length; i < len; i++) {
        elmContentTexts[i] = elems[i].textContent;
      }

    } else {
      elmContents = elmMainInner.getElementsByClassName("hentry")[0]
                                .getElementsByClassName("entry-content")[0]
                                .querySelectorAll(HEADLINE.sources.join());

      // 見出しがn個以下なら目次を表示しない
      if (elmContents.length <= HEADLINE.min) {
        hideStoc();
        return;
      }
    }

    /*********************************************
     * 見出しリストを作成
     *********************************************/
    let headlines = [];
    let currentLevel = 0;

    // タグの設定
    let level = 0, line = "";
    for (let i = 0; i < elmContents.length; i++) {
      const elem = elmContents[i];
      const text = canListUpPages ? elmContentTexts[i] : elem.textContent;

      // a要素を作成
      // （目次記法がある時は、すでにIDが設定されているのでそれを使う）
      let idName;
      if (hasTocOnBody) {
        idName = elem.id;

      } else {
        idName = "section" + i;
        elem.setAttribute("id", idName);

      }

      line =`<li><a href="#${idName}">${escapeHtml(text)}</a>`;

      // 階層を作成
      if (canListUpPages) continue; // 階層が必要ないページ
      const nodeName     = elem.nodeName.toLowerCase();
      const headlineTags = HEADLINE.sources;
      for (let j = 1; j < headlineTags.length; j++) {
        if (nodeName !== headlineTags[j]) continue;

        level = j;
        break;
      }

      while (currentLevel < level) {
        line = `<${HEADLINE.tag}>${line}`;
        currentLevel++;
      }

      while (currentLevel > level) {
        line = `</${HEADLINE.tag}></li>${line}`;
        currentLevel--;
      }

      headlines[i] = line;
      level = 0;
    }

    /*********************************************
     * モジュールタイトルの追加（設定によっては追加しない）
     *********************************************/
    const getModuleTitle = () => {
      let title = "";
      if (pageListTitle !== "") {
        if ((!canListUpPages) && (pageListTitle === classDefs.entryTitle)) {
          title = elmMainInner
                 .getElementsByClassName(classDefs.entryLink)[0]
                 .textContent;

        } else {
          title = pageListTitle;

        }
      }

      return title;
    };

    let StocTitle = getModuleTitle();

    // 最初に設定されているタイトルを削除
    const clsModuleTitle  = classDefs.moduleTitle;
    const elmModuleTitles = elmSidebarModule
                            .getElementsByClassName(clsModuleTitle);
    const elmModuleTitle  = elmModuleTitles[0];
    if (elmModuleTitle) elmSidebarModule.removeChild(elmModuleTitle);

    let elmStocTitle = false;
    if (StocTitle) {
      const title    = escapeHtml(StocTitle);
      const titleDiv = addDiv();
      titleDiv.id        = stocIds.title;
      titleDiv.className = classDefs.moduleTitle;
      // リンクとスムーズスクロールも追加
      titleDiv.innerHTML = CAN_LINK_MODULE_TITLE ? `<a href="#">${title}</a>`: title;

      elmStocTitle = elmSidebarModule.insertBefore(
        titleDiv,
        elmSidebarModule.firstElementChild
      );

      // ページの頂点に移動
      if (CAN_LINK_MODULE_TITLE) {
        elmStocTitle.getElementsByTagName("a")[0].addEventListener(
          "click",
          function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (CAN_SMOOTH_SCROLL) {
              smoothScrollY(0, SCROLL_TIME);

            } else {
              win.scrollTo(win.pageXOffset, 0);
            }
          },
          false
        );
      }
    }

    // module-bodyにIDを設定
    elmSidebarModuleBody.id = stocIds.body;

    // 目次本体の追加
    const ol = doc.createElement("ol");
    ol.innerHTML = headlines.join("");
    elmStoc.appendChild(ol);

    elmSidebarModule.setAttribute("id", stocIds.module);
    console.log("%c--add toc--", "color:blue");

    // a要素一覧の取得とスムーズスクロールの設定
    const elmStocAnchors = elmStoc.getElementsByTagName("a");
    const clsStocAnchors = [];
    for (let i = 0; i < elmStocAnchors.length; i++) {
      elmStocAnchors[i].addEventListener("click", clickEvent, false);
      clsStocAnchors[i] = elmStocAnchors[i].classList;
    }

    /*********************************************
     * スクロール用
     *********************************************/
    const elmMain = doc.getElementById("main");
    const elmBox2 = doc.getElementById("box2");
    const clsSidebarModule = elmSidebarModule.classList;
    const elmGhs = [];

    for (let i = 0; i < GLOBAL_HEADERS.length; i++) {
      const globalHeader = GLOBAL_HEADERS[i];
      const globalElems  = getElementsSelector(globalHeader);

      if (!globalElems[0]) {
        console.error("GLOBAL_HEADERS: %s が見つかりません", globalHeader);
        return;
      }

      elmGhs.push(globalElems[0]);
    }

    const tocLastIndex = headlines.length - 1;
    let headlineTops   = [];
    let scrollRange, scrollFixed, scrollAbsolute, followModule;
    let canTrackScroll  = false;
    let ghFixedHeight, marginComp, relativeOffset, leftMargin;
    let tocMaxHeight, canDrawScrollBar;
    let prevScrollLeft;

    const tocModuleStyles = {};
    tocModuleStyles[positions.absolute] = { left: "" };
    tocModuleStyles[positions.fixed]    = {};
    tocModuleStyles[positions.static]   = {};

    // スクロール可能か判別しやすくする
    if (SCROLL.canShowBarShadow) elmStoc.classList.add(classDefs.shadow);

    // タッチデバイス用の処理
    if (TOUCH.device) {
      // 判定用のクラス追加
      elmStoc.classList.add(classDefs.touch);
      clsSidebarModule.add(classDefs.touch);
    }

    // ブラウザが position:sticky に対応していればクラス追加
    let isStickyMode = false;
    if (TOUCH.device || IS_STICKY_MODE) {
      const propNames = [`-webkit-${positions.sticky}`, positions.sticky];
      const styDiv    = addDiv().style;

      for (let i = 0; i < propNames.length; i++) {
        styDiv.position = propNames[i];
        isStickyMode   = styDiv.position.indexOf(positions.sticky) !== -1;
        if (!isStickyMode) continue;

        clsSidebarModule.add("sticky");
        break;
      }
    }

    /*********************************************
     * ガイド要素の作成と追加
     *********************************************/
    const divGuide = addDiv();
    divGuide.id        = stocIds.guide;
    divGuide.className = "hatena-module";
    divGuide.style.cssText = [
      "visibility: hidden;",
      "height: 0;",
      "margin-top: 0;",
      "margin-bottom: 0;",
      "padding-top: 0;",
      "padding-bottom: 0;",
      "border-top: 0;",
      "border-bottom: 0;",
    ].join("");

    let   elmGuide, elmSubGuide, isLastModuleToc;
    const elmBox2Inner      = elmSidebarModule.parentNode;
    const elmChildren       = elmBox2Inner.children;
    const elmChildrenLength = elmChildren.length;

    // 目次モジュールしか無い時はガイドを直前に追加
    if (elmChildrenLength === 1) {
      elmGuide = elmBox2Inner.insertBefore(divGuide, elmSidebarModule);
      isLastModuleToc = true;

      console.log("%csingleModule", "color:blue");

    // 目次をサイドバーの最後に設置してる時はその一つ前に、
    // それ以外の時は最後にガイドを追加
    } else {
      isLastModuleToc = elmChildren[elmChildrenLength - 1] === elmSidebarModule;

      // マージン相殺計測用
      if (isLastModuleToc) {
        elmSubGuide    = elmSidebarModule.previousElementSibling;
        elmSubGuide.id = stocIds.subGuide;
        elmGuide = elmBox2Inner.insertBefore(divGuide, elmSidebarModule);

      } else {
        elmGuide = elmBox2Inner.appendChild(divGuide);
      }
    }

    console.timeEnd("sidebarToc add");

    /*********************************************
     * イベント登録
     *********************************************/
    // ウィンドウのリサイズ操作が終わった時に処理する
    let timer;
    win.addEventListener(
      "resize",
      function () {
        clearTimeout(timer);
        timer = setTimeout(setTrackingPoint, 200);
      },
      false
    );

    // CSSのフェード終了時
    elmSidebarModule.addEventListener(
      "animationend",
      function () {
        clsSidebarModule.remove(classDefs.fadeId);
      },
      false
    );

    /*********************************************
     * 関数式
     *********************************************/

    /**
     * 現在位置を表示するためのクラス設定とスクロール処理
     */
    const activateFollow = (function () {
      let active = -1;
      return function (i) {
        if (i === active) return;
        if (active >= 0) clsStocAnchors[active].remove(classDefs.active);

        active = i;
        if (i < 0) return;

        let elmAnchor = elmStocAnchors[i];
        clsStocAnchors[i].add(classDefs.active);

        if (!FOLLOW.canScrollOverBottom) return;
        if (!canDrawScrollBar) return;
        if (!canTrackScroll)   return;

        elmStoc.scrollTop
        = elmAnchor.offsetTop
        + elmAnchor.offsetHeight
        - tocMaxHeight;
      };
    })();

    /**
     * モジュール固定位置が変わったかチェック
     */
    const confirmPosition = (function () {
      let current = 0;
      return {
        update: function (set, callback) {
          if (set !== current && followModule) {
            if (callback) callback(current);

            current = set;
            return true;
          }
          return false;
        },

        get: function () {
          return current;

        },

        set: function (set) {
          current = set;

        },
      };
    })();

    const updatePosition = confirmPosition.update;
    const getPosition    = confirmPosition.get;
    const setPosition    = confirmPosition.set;

    /**
     * スクロールイベントの追加と削除
     */
    const setScrollEvent = (function () {
      let current = false;
      const event = "scroll";

      return function (b) {
        if (b === current) return;

        if (current) {
          win.removeEventListener(event, updateScroll, false);

        } else {
          win.addEventListener(event, updateScroll, false);
          current = b;
        }
      };
    })();

    /*********************************************
     * 
     *********************************************/
    /**
     * 追尾処理開始部分
     */
    const startTracking = () => {
      // 最初に一度位置取得などを行う
      setTrackingPoint();

      // 特定の要素をクリックした後に位置取得をやり直す
      let timer;
      const selectors = UPDATE_AFTER_CLICK.selectors;
      for (let i = 0; i < selectors.length; i++) {
        const elems = getElementsSelector(selectors[i]);

        for (let j = 0; j < elems.length; j++) {
          elems[j].addEventListener(
            "click",
            function () {
              clearTimeout(timer);
              timer = setTimeout(setTrackingPoint, UPDATE_AFTER_CLICK.delayTime);
            },
            false
          );
        }
      }

      // ページの読込が完全に終わったタイミングで再度位置取得などを行う
      win.addEventListener(
        "load",
        function () {
          console.timeEnd("Event:DOMContentLoaded -> load");
          setTimeout(setTrackingPoint, DELAY.afterPageLoaded);
        },
        false
      );
    }

    if (!DELAY.canWaitDomLoad) {
      setDOMContentLoaded(startTracking);

    } else {
      startTracking();

    }

    /*********************************************
     * 関数宣言
     *********************************************/

    /**
     * 目次要素全体を非表示にする
     */
    function hideStoc() {
      stySidebarModule.display = "none";

      console.log("%c---sidebar toc hide---", "color:blue");
    }

    /**
     * スムーズスクロールと履歴を設定
     */
    function clickEvent(e) {
      e.preventDefault();
      const hash   = decodeURIComponent(e.currentTarget.hash);
      const target = scrollTopJs(doc.getElementById(hash.substr(1)))
        - ghFixedHeight + SCROLL.reactionTime;

      if (CAN_SMOOTH_SCROLL) {
        smoothScrollY(Math.min(target, scrollRange), SCROLL_TIME);

      } else {
        win.scrollTo(win.pageXOffset, target);

        if (CAN_RECORD_CLICK_HISTORY) win.history.pushState(null, hash, hash);

      }
    }

    /**
     * モジュール内スクロールバー表示の有無を設定
     */
    function setTocScrollBar(canDraw) {
      canDrawScrollBar = canDraw;

      elmStoc.style.maxHeight = canDraw ? toPixel(tocMaxHeight) : "";
    }

    /**
     * 目次モジュールの設定
     */
    function setTocModuleOption(position) {
      const style 　　= tocModuleStyles[position];
      canTrackScroll = position !== positions.static ? true : false;

      Object.keys(style).forEach(function (key) {
        stySidebarModule[key] = style[key];
      });

      if (canTrackScroll) clsSidebarModule.add(classDefs.tracking);
      else clsSidebarModule.remove(classDefs.tracking);

      if (positions.fixed === position) clsSidebarModule.add(classDefs.fixed);
      else clsSidebarModule.remove(classDefs.fixed);

      if (positions.absolute === position)
        clsSidebarModule.add(classDefs.absolute);
      else clsSidebarModule.remove(classDefs.absolute);

      setTocScrollBar(canTrackScroll);
    }

    /**
     * 追尾処理に必要な値を設定
     */
    function setTrackingPoint() { // アロー関数にすると動かない…

      /**
       * サイドバーが横に表示されているか
       */
      const existSidebar = () => {
        if (MEDIA_QUERY.canSet) return win.matchMedia(MEDIA_QUERY.queryToDisplay).matches;

        return getComputedStyleWithWrap(elmBox2).cssFloat !== "none";
      }

      /**
       * スクロールイベントと追尾を設定
       *
       * @param {boolean}  hasEvent
       * @param {boolean}  canFollow
       * @param {Function} callback
       */
      const setEventAndFollow = (hasEvent, canFollow, callback) => {
        setScrollEvent(hasEvent);
        followModule = canFollow;

        console.log(
          "%cscrollEvent:%s followModule:%s",
          "color:blue",
          hasEvent,
          canFollow
        );

        if (hasEvent && canFollow) {
          callback();
          return;
        }

        setPosition(0);
        setTocModuleOption(positions.static);
        if (isStickyMode) elmBox2Inner.style.height = "";

        if (hasEvent) return;
        for (let i = 0; i < clsStocAnchors.length; i++) {
          clsStocAnchors[i].remove(classDefs.active);
        }
      }

      /**
       * 指定したプロパティが設定されてない時の高さを取得
       *
       * @param {Element}    getElem
       * @param {Element} targetElem
       * @param {number}  styleName
       *
       * @returns {number} ボックスの高さ
       */
      const getStaticHeight = (getElem, targetElem, styleName) => {
        const style = targetElem.style;
        const mem   = style[styleName];
        style[styleName] = "";

        let ret = outerHeightJs(getElem, true);
        style[styleName] = mem;

        return ret;
      }

      /**
       * マージンの相殺で失われた分を返す
       * (引数配列は親→子の順番で書く)
       *
       * @param {[Element]} elemsTop
       * @param {[Element]} elemsBottom
       *
       * @returns {number} `Margin`の相殺で失った高さ
       */
      const getCollapsedMargin = (elemsTop, elemsBottom) => {
        const marginTop    = max(filter(elemsTop,    0), heightProps.margin[0]);
        const marginBottom = max(filter(elemsBottom, 1), heightProps.margin[1]);
        if (marginTop === 0 || marginBottom === 0) return 0;

        return Math.min(marginTop, marginBottom);
      }

      /**
       * 各要素の指定したプロパティで一番大きい数値を返す
       *
       * @param {[Element]} elems
       * @param {string}    styleName
       *
       * @returns {[Element]}
       */
      const max = (elems, styleName) => {
        let arr = [];
        for (let i = 0; i < elems.length; i++) {
          arr[i] = style2FloatingNumber(elems[i], styleName);
        }

        return Math.max.apply(null, arr);
      }

      /**
       * `padding`, `border`があって相殺が起こらないパターンを除外する
       *
       * @note
       * 親要素に`padding`, `border`がなければそのまま、あれば親要素だけ返す
       * マージンの相殺が起こらないパターンは他にもある
       * - tb
       *   - 0: top
       *   - 1: bottom
       *
       * @param {[Element]} elems
       * @param {number}    tb
       *
       * @returns {[Element]}
       */
      const filter = (elems, tb) => {
        const maxIndex = elems.length - 1;
        const  tbIndex = tb * 2;
        if (maxIndex <= 0) return elems;

        let num;
        for (let i = 0; i < maxIndex; i++) {
          for (let j = 0; j < 2; j++) {
            num = style2FloatingNumber(elems[i], heightProps.padding[j + tbIndex]);
            if (num > 0) return elems.slice(0, i + 1);
          }
        }
      }

      console.log(
        "%c--setTrackingPoint %s--",
        "color:blue",
        Date().match(/\d\d:\d\d:\d\d/)[0]
      );

      /*********************************************
       * 
       *********************************************/
      const winHeight  = win.innerHeight;
      const scrollbarX = winHeight - doc.documentElement.clientHeight;
      const mainHeight = Math.max(
        outerHeightJs(doc.getElementById("wrapper")),
        outerHeightJs(elmMain)
      );

      scrollRange   = Math.max(doc.documentElement.scrollHeight - winHeight, 0);
      ghFixedHeight = 0;

      let ghPosition;
      for (let i = 0; i < elmGhs.length; i++) {
        ghPosition = getComputedStyleWithWrap(elmGhs[i]).position;
        ghFixedHeight += ghPosition === positions.fixed
                       ? outerHeightJs(elmGhs[i])
                       : 0;
      }
      console.log("ghFixedHeight:" + ghFixedHeight);

      marginComp = ghFixedHeight + MODULE_SIZE.marginTop;
      leftMargin = elmGuide.getBoundingClientRect().left + win.pageXOffset;

      // 計測用に.trackingを付与。また後で戻せるように保存しておく。
      const existTracking = clsSidebarModule.contains(classDefs.tracking);
      if (!existTracking) clsSidebarModule.add(classDefs.tracking);

      // 目次部分の高さを画面内に収まるように計算
      const moduleBlankSpaceHeight
      = sumPropValues(elmSidebarModule, heightProps.padding)
      + sumPropValues(elmSidebarModuleBody,
                      heightProps.padding.concat(heightProps.margin));

      const tocTitleHeight = elmStocTitle
        ? outerHeightJs(elmStocTitle, true)
          + getCollapsedMargin([elmSidebarModuleBody], [elmStocTitle])
        : 0;
      tocMaxHeight = winHeight
                   - scrollbarX
                   - marginComp
                   - MODULE_SIZE.marginBottom
                   - moduleBlankSpaceHeight
                   - tocTitleHeight;

      if (MODULE_SIZE.maxHeight) {
        const maxHeight = MODULE_SIZE.maxHeight - moduleBlankSpaceHeight - tocTitleHeight;
        if (tocMaxHeight > maxHeight) tocMaxHeight = maxHeight;
      }

      // .trackingでborder等を付与する時でもマージンの相殺が計測できるように外す
      clsSidebarModule.remove(classDefs.tracking);

      // 各見出しの位置を保存
      for (let i = 0; i < elmContents.length; i++) {
        headlineTops[i] = scrollTopJs(elmContents[i]) - ghFixedHeight;
      }

      console.assert(
        headlineTops[0] !== headlineTops[1],
        "見出し位置の重複：DELAY.canWaitDomLoadを確認"
      );

      // 横幅を合わせる
      stySidebarModule.width = getComputedStyleWithWrap(elmGuide).width;

      // 現在位置表示をリセット
      activateFollow(-1);

      /*********************************************
       * 追尾処理判定
       *********************************************/
      // サイドバーが横に表示されていない時
      if (!existSidebar()) {
        setEventAndFollow(!FOLLOW.stop.whenNoSideBar, false);
        if (FOLLOW.stop.whenNoSideBar) return;

      // サイドバーより記事の方が小さい時
      } else if (getStaticHeight(elmBox2, elmBox2Inner, "height") > mainHeight) {
        setEventAndFollow(!FOLLOW.stop.whenEntrySmaller, false);
        if (FOLLOW.stop.whenEntrySmaller) return;

      } else {
        setEventAndFollow(true, true, function () {
          setTocScrollBar(canTrackScroll);
          setPosition(-1);
          prevScrollLeft = 0;

          const mainInnerHeight = outerHeightJs(elmMainInner);
          const margins = getFloatByNoClassElement(
            elmSidebarModule,
            ["marginTop", "marginLeft"],
            [classDefs.tracking, classDefs.fixed, classDefs.absolute]
          );

          const tocModuleMarginTopUnsetClass  = margins[0];
          const tocModuleMarginLeftUnsetClass = margins[1];
          leftMargin -= tocModuleMarginLeftUnsetClass;

          // 親要素の高さを合わせるs
          if (isStickyMode) elmBox2Inner.style.height = toPixel(mainInnerHeight);

          /*********************************************
           * ウィンドウに固定開始する位置
           *********************************************/
          scrollFixed = scrollTopJs(elmGuide)
                      - ghFixedHeight
                      + tocModuleMarginTopUnsetClass
                      + MODULE_SIZE.fixedTop;

          if (elmSubGuide) {
            scrollFixed -= getCollapsedMargin(
              elmStocTitle
                ? [elmSidebarModule, elmStocTitle]
                : [elmSidebarModule],
              [elmSubGuide, elmSubGuide.children[1]]
            );
          }

          if (isLastModuleToc) {
            scrollFixed -= MODULE_SIZE.marginTop;

          } else if (canTrackScroll) {
            scrollFixed += getStaticHeight(
              elmSidebarModule,
              elmStoc,
              "maxHeight"
            );
          }

          /*********************************************
           * 下までスクロールした時にページへ固定開始する位置
           *********************************************/
          const tocModuleMaxHeight = Math.min(
            winHeight - marginComp,
            outerHeightJs(elmSidebarModule)
          );

          scrollAbsolute = scrollTopJs(elmMainInner)
                          + mainInnerHeight
                          - tocModuleMaxHeight
                          - marginComp;

          // 親要素にposition:relativeがあれば位置を保存する
          relativeOffset = elmGuide.offsetParent !== doc.body
                          ? scrollTopJs(elmGuide.offsetParent)
                          : 0;

          /*********************************************
           * モジュール固定位置
           *********************************************/
          tocModuleStyles[positions.fixed].top = toPixel(
            marginComp - tocModuleMarginTopUnsetClass
          );

          tocModuleStyles[positions.absolute].top = toPixel(
            scrollAbsolute
            - relativeOffset
            + marginComp
            - tocModuleMarginTopUnsetClass
          );

          console.log("relativeOffset:" + relativeOffset);

          if (elmSubGuide) {
            const margin = getCollapsedMargin(
              elmStocTitle
                ? [elmSidebarModule, elmStocTitle]
                : [elmSidebarModule],
              [elmSubGuide, elmSubGuide.children[1]]
            )

            console.log("getCollapsedMargin:" + margin);
          }

          console.log("tocModuleMargin Top:%d Left:%d",
                       tocModuleMarginTopUnsetClass,
                       tocModuleMarginLeftUnsetClass);
          console.log("SidebarToc.top:" + scrollTopJs(elmSidebarModule));
          console.log("scrollFixed   :" + scrollFixed);
          console.log("scrollAbsolute:" + scrollAbsolute);
        });
      }

      // .trackingを戻す
      if (existTracking) clsSidebarModule.add(classDefs.tracking);

      updateScroll();
    }

    /**
     * 現在のスクロール位置をもとに表示を更新
     */
    function updateScroll() {
      const scrollTop  = win.pageYOffset;
      const scrollLeft = win.pageXOffset;

      // setFollowingModule(scrollTop);

      // 固定解除(下)
      if (scrollAbsolute < scrollTop) {
        if (updatePosition(2)) {
          setTocModuleOption(positions.absolute);
          prevScrollLeft = 0;
        }

      // 固定
      } else if (scrollFixed < scrollTop) {
        updatePosition(1, function (current) {
          // サイドバーの最後以外に設置されていて直前が初期位置の時はフェードインさせる
          if (!isLastModuleToc && current === 0) {
            clsSidebarModule.add(classDefs.fadeId);
          }

          setTocModuleOption(positions.fixed);
        });

      // 初期位置
      } else {
        if (updatePosition(0)) setTocModuleOption(positions.static);

      }

      // adjustScrollX(scrollLeft, prevScrollLeft);

      if (!isStickyMode && getPosition() === 1 && scrollLeft !== prevScrollLeft) {
        stySidebarModule.left = toPixel(leftMargin - scrollLeft);
        prevScrollLeft = scrollLeft;
      }

      // setCurrentPositionClass(scrollTop);

      if (scrollTop <= headlineTops[0] - FOLLOW.switchPoint) {
        activateFollow(0);

      } else if (scrollRange - scrollTop <= FOLLOW.switchPoint) {
        activateFollow(tocLastIndex);

      } else {
        for (let i = tocLastIndex; i >= 0; i--) {
          if (scrollTop <= headlineTops[i] - FOLLOW.switchPoint) continue;

          activateFollow(i);
          break;
        }
      }
    }

    /**
     * followModuleがtrueの時だけモジュールを追従させる
     */
    const setFollowingModule = (scrollTop) => {
      // 固定解除(下)
      if (scrollAbsolute < scrollTop) {
        if (updatePosition(2)) {
          setTocModuleOption(positions.absolute);
          prevScrollLeft = 0;
        }

      // 固定
      } else if (scrollFixed < scrollTop) {
        updatePosition(1, function (current) {
          // サイドバーの最後以外に設置されていて直前が初期位置の時はフェードインさせる
          if (!isLastModuleToc && current === 0) {
            clsSidebarModule.add(classDefs.fadeId);
          }
          setTocModuleOption(positions.fixed);
        });

      // 初期位置
      } else {
        if (updatePosition(0)) setTocModuleOption(positions.static);

      }
    }

    /**
     * 横方向のスクロールに合わせる
     */
    const adjustScrollX = (scrollLeft) => {
      if (!isStickyMode &&
          getPosition() === 1 &&
          scrollLeft !== prevScrollLeft) {

        stySidebarModule.left = toPixel(leftMargin - scrollLeft);
        prevScrollLeft = scrollLeft;
      }
    }

    /**
     * 現在位置のクラス設定
     */
    const setCurrentPositionClass = (scrollTop) => {
      if (scrollTop <= headlineTops[0] - FOLLOW.switchPoint) {
        activateFollow(0);

      } else if (scrollRange - scrollTop <= FOLLOW.switchPoint) {
        activateFollow(tocLastIndex);

      } else {
        for (let i = tocLastIndex; i >= 0; i--) {
          if (scrollTop <= headlineTops[i] - FOLLOW.switchPoint) continue;

          activateFollow(i);
          break;
        }
      }
    }
  }

  /**
   * HTMLの読込と解析が終わったら
   */
  const setDOMContentLoaded = (func) => {
    win.addEventListener(
      "DOMContentLoaded",
      function () {
        console.time("Event:DOMContentLoaded -> load");
        setTimeout(func, DELAY.afterDomLoaded);
      },
      false
    );
  }

  // 見出しなどを取得するタイミングをHTMLが読み込まれたあとにする
  if (DELAY.canWaitDomLoad) setDOMContentLoaded(main);
  else main();

  //# sourceURL=sidebar_toc.js
}

/**
 * 外部から呼び出し可
 */
export { index };
