/**
 * 追尾する目次（ver3.3.0）
 *
 * 【参考】
 * はてなブログ向けのサイドバーで追尾する目次【ver3】 http://twilyze.hatenablog.jp/entry/sidebar-toc-3
 * https://gist.github.com/twilyze/30809fa76691983312dced621eb1040a
 */

import { SidebarToc } from "./SidebarToc/sidebarToc.js";

//# sourceURL=sidebar_toc.js
 const index = () => {
  "use strict";

  /*********************************************
   * 設定
   *********************************************/
  const page = new Page();
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

  /*********************************************
   * 仕様系
   *********************************************/
  const win = window;
  const doc = document;

  const tocIds = {
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
   * メイン
   *********************************************/
  console.log(
    "%c---sidebar toc---  DELAY.afterDomLoaded:" + DELAY.afterDomLoaded,
    "color:blue"
  );

  console.time("sidebarToc add");

  // 目次モジュール
  const sidebarTocModule = new SidebarToc(doc);

  // ページの種類を判定
  let currentPage = getPageCategory(doc, PAGE_CATEGORIES);
  if (!currentPage) {
    hideSidebarToc(stySidebarModule);
    return; // 終了
  }

  // 目次記法の目次にもスムーズスクロールを適用
  const canListUpPages = currentPage.canListUpPages;
  const pageListTitle  = currentPage.title;
  const elmMainInner   = doc.getElementById("main-inner");

  let hasTocOnBody = false;
  if (!canListUpPages) hasTocOnBody = setSmoothScrollToHatenToc(elmMainInner);

  if (TOUCH.isDisable) {
    hideSidebarToc(stySidebarModule);
    return;
  }


}

/*********************************************
 * 関数宣言
 *********************************************/
 /**
 * SidebarToc用の要素を取得する
 *
 * @param {string} id モジュールのid
 *
 * @return {Element}
 */
const getSidebarElement = (id) => {
  console.log(id);
  const elem = doc.getElementById(id);

  if (!elem) {
    console.error("sidebarToc: 要素が見つかりません");
    return;
  }

  return elem;
}

/**
 * 現在のページの種類を取得する
 *
 * @param {Document} doc
 * @param {object}   PAGE_CATEGORIES
 *
 * @return {Element} ページの種類を表す要素
 */
const getPageCategory = (doc, PAGE_CATEGORIES) => {
  let currentPage;

  const bodyClassList = doc.body.classList;
  for (let i = 0; i < PAGE_CATEGORIES.length; i++) {
    currentPage = PAGE_CATEGORIES[i];

    if(!bodyClassList.contains(currentPage.class)) continue;
    if(!currentPage.display) break;

    console.log("page:" + currentPage.class);
    break;
  }

  return currentPage;
}

/**
 * 目次要素全体を非表示にする
 */
const hideSidebarToc = (stySidebarModule) => {
  stySidebarModule.display = "none";

  console.log("%c---sidebar toc hide---", "color:blue");
}

/**
 * 目次記法の目次にスムーズスクロールを適用する
 *
 * @param {Element} elmHatenaToc
 *
 * @return {boolean} 本文に目次記法の目次があるか
 */
const setSmoothScrollToHatenToc = (elmMainInner) => {
  const clsHatenaToc = "table-of-contents";
  const elmHatenaToc = elmMainInner.getElementsByClassName(clsHatenaToc)[0];

  if (!elmHatenaToc) return false;

  const tocAnchor = elmHatenaToc.getElementsByTagName("a");
  for (let i = 0; i < tocAnchor.length; i++) {
    tocAnchor[i].addEventListener("click", clickEvent, false);
  }

  return true;
}

/**
 * 外部から呼び出し可
 */
export { index };
