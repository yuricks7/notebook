import { SidebarToc } from "./SidebarToc.js";
import { BlogPage }   from "./BlogPage.js";
import { CssProperties } from "./CssProperties.js";
import { HtmlOperator, HtmlOperator as HtmlOps } from "./HtmlOperator.js";
import { ScrollEvent } from "./ScrollEvent.js"

/**
 * 追尾する目次（ver3.3.0）
 *
 * 【参考】
 * はてなブログ向けのサイドバーで追尾する目次【ver3】 http://twilyze.hatenablog.jp/entry/sidebar-toc-3
 * https://gist.github.com/twilyze/30809fa76691983312dced621eb1040a
 */
const main = () => {

  //# sourceURL=sidebar_toc.js

  /*********************************************
   * メイン
   *********************************************/
  "use strict";

  const blogPage = new BlogPage();
  const doc       = blogPage.doc;
  const classDefs = blogPage.selector.class;
  const stoc = new SidebarToc(doc, classDefs.moduleTitle); // 目次モジュール

  const delay = stoc.delay;
  const m = `%c---sidebar toc---  delay.afterDomLoaded: ${delay.afterDomLoaded}`;
  console.log(m, "color:blue");
  console.time("sidebarToc is added");

  /* -------------------------------------------
     ページの種類を判定
   --------------------------------------------- */
  let pageCategory = blogPage.getCategory();
  let canContinue  = stoc.hide(!pageCategory.canDisplay);
  if (!canContinue) return; // 終了

  /* -------------------------------------------
     目次記法の目次
   --------------------------------------------- */
  const canListUpPages = pageCategory.canListUpPages;
  const elmMainInner   = blogPage.element.mainInner;
  let hasTocOnBody = false;
  if (!canListUpPages) hasTocOnBody = setSmoothScrollTocOnBody(elmMainInner);

  // タッチデバイスで動かさない設定の時は、「非表示」にして終了
  canContinue = stoc.hide(stoc.touch.isDisable);
  if (!canContinue) return; // 終了

  /* -------------------------------------------
     見出しリストを作成
   --------------------------------------------- */
  stoc.getHeadLineSources(blogPage, canListUpPages);
  stoc.generateHeadingList(hasTocOnBody, canListUpPages);

  /* -------------------------------------------
     モジュールタイトルの追加（設定によっては追加しない）
   --------------------------------------------- */
  const stocModule      = stoc.module;
  const stocModuleElems = stocModule.elements;

  // 最初に設定されているタイトルを削除して、設定し直す
  const pageListTitle = pageCategory.title;
  let newStocTitleElem = stoc.setModuleTitle(pageListTitle, canListUpPages, classDefs);

  // ページ頂点への移動を追加
  const canLinkTitle = stoc.link.canLinkModuleTitle;
  setScrollToTop(canLinkTitle, stoc, blogPage.window, newStocTitleElem);

  /* -------------------------------------------
     目次本体の追加
   --------------------------------------------- */
  // module-bodyにidを設定
  const stocIds = stoc.ids;
  stocModuleElems.body.id = stocIds.body;
  stocModule.element.setAttribute("id", stocIds.module);

  // 目次本体を追加
  let elmStoc = stoc.addBody();
  console.log("%c--add toc--", "color:blue");

  // a要素一覧の取得とスムーズスクロールの設定
  const elmStocAnchors = stoc.addAnchors(elmStoc, clickEvent);

  /* -------------------------------------------
     スクロール用
   --------------------------------------------- */
  const stocModuleClassList = stocModule.classList;
  const stocLastIndex = stoc.headlines.length -1;
  let canTrackScroll  = false;

  const stocModuleStyles = {};
  const cssProps = new CssProperties();
  const positions = cssProps.values.position;
  stocModuleStyles[positions.absolute] = { left: "" };
  stocModuleStyles[positions.fixed]    = {};
  stocModuleStyles[positions.static]   = {};

  // スクロール可能か判別しやすくする
  stoc.addShadowBar(classDefs.shadow);

  // タッチデバイス用の処理
  stoc.addTouchClass(classDefs.touch);

  // （ブラウザが`position:sticky`に対応していれば）クラス追加
  const isStickyMode = stoc.addStickyClass();

  /* -------------------------------------------
     ガイド要素の作成と追加
   --------------------------------------------- */
  const htmlOps  = new HtmlOperator;
  const divGuide = htmlOps.addDiv();
  guideCss = [
    "visibility: hidden;",
    "height: 0;",
    "margin-top: 0;",
    "margin-bottom: 0;",
    "padding-top: 0;",
    "padding-bottom: 0;",
    "border-top: 0;",
    "border-bottom: 0;",
  ];
  divGuide.id            = stocIds.guide;
  divGuide.className     = "hatena-module";
  divGuide.style.cssText = guideCss.join("");




  // 未使用
  const pageCategories = blogPage.categories;


}

/*********************************************
 * 関数宣言
 *********************************************/
/**
 * 目次記法の目次にスムーズスクロールを適用する
 *
 * @param {Element} elmHatenaToc
 *
 * @return {boolean} 本文に目次記法の目次があるか
 */
const setSmoothScrollTocOnBody = (elmMainInner) => {
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
 * スムーズスクロールと履歴を設定
 */
const clickEvent = (e) => {
  e.preventDefault();

  const blogPage = new BlogPage();
  const doc  = blogPage.doc;
  const win  = blogPage.window;

  const stoc   = new SidebarToc(doc);
  const scroll = stoc.scroll;

  // 一時的に元のコードからコピペ-----------
  const winHeight   = win.innerHeight;
  let scrollRange   = Math.max(doc.documentElement.scrollHeight - winHeight, 0);
  let ghFixedHeight = 0;
  // ----------------------------------

  const hash   = decodeURIComponent(e.currentTarget.hash);
  const target = scrollTopJs(win, doc.getElementById(hash.substr(1)))
               - ghFixedHeight + scroll.reactionTime;

  if (scroll.isSmooth) {
    smoothScrollY(Math.min(target, scrollRange), scroll.time);

  } else {
    win.scrollTo(win.pageXOffset, target);
    if (stoc.link.canLinkModuleTitle) win.history.pushState(null, hash, hash);

  }
}

/**
 * $.scrollTop()
 *
 * @param {Element} elem
 * @param {number}  scrollTop
 *
 * @return {number} スクロール位置
 */
function scrollTopJs(win, elem, scrollTop) {
  const boundaryTop = elem.getBoundingClientRect().top;
  const offsetY     = (scrollTop !== void 0 ? scrollTop : win.pageYOffset); // 変数名が不適切かも…

  return boundaryTop + offsetY;
}


/**
 * 縦方向のスムーズスクロール
 */
const smoothScrollY = (function () {
  const blog = new BlogPage();
  const win  = blog.window;

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

  return (target, duration) => {
    const startTime = timer.now();
    const startY = win.pageYOffset;
    const startX = win.pageXOffset;
    const distance = target - startY;
    let elapsedTime;

    /**
     * requestAnimationFrame
     * （アロー関数にすると動かない模様…）
     */
    const sendRAF = (timestamp) => {
      elapsedTime = timestamp - startTime;
      if (elapsedTime >= duration) {
        scrollTo(startX, target);
        return;
      }
      scrollTo(
        startX,
        easeInOutQuad(elapsedTime / duration) * distance + startY
      );
      requestId = request(sendRAF);
    }

    /**
     * setTimeout
     */
    const setTimeout = () => {
      elapsedTime = timer.now() - startTime;
      if (elapsedTime >= duration) {
        scrollTo(startX, target);
        return;
      }
      scrollTo(
        startX,
        easeInOutQuad(elapsedTime / duration) * distance + startY
      );
      requestId = request(setTimeout, frameTime);
    }

    cancel(requestId);
    requestId = request(existRAF ? sendRAF : setTimeout);
  };
})();

/**
 * モジュールのタイトルからページの頂点に移動できるようにする
 *
 * @param {boolean}    canLinkTitle
 * @param {SidebarToc} stoc
 * @param {Window}     win
 * @param {Element}    elmStocTitle
 */
const setScrollToTop = (canLinkTitle, stoc, win, elmStocTitle) => {
  if (!canLinkTitle) return;

  const scroll = stoc.scroll;
  elmStocTitle.getElementsByTagName("a")[0]
                    .addEventListener(
                      "click",
                      function(e) {
                        e.preventDefault();
                        e.stopPropagation();

                        if (scroll.isSmooth) {
                          smoothScrollY(0, scroll.time);

                        } else {
                          win.scrollTo(win.pageXOffset, 0);

                        }
                      },
                      false
                    );
}

/**
 * 外部から呼び出し可
 */
export { main };
