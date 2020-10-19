import { SidebarToc } from "./SidebarToc.js";
import { BlogPage }   from "./BlogPage.js";
import { HtmlOperator as HtmlOps } from "./HtmlOperator.js";
import { ScrollEvent } from "./ScrollEvent.js"

/**
 * 追尾する目次（ver3.3.0）
 *
 * 【参考】
 * はてなブログ向けのサイドバーで追尾する目次【ver3】 http://twilyze.hatenablog.jp/entry/sidebar-toc-3
 * https://gist.github.com/twilyze/30809fa76691983312dced621eb1040a
 */
const index = () => {

  //# sourceURL=sidebar_toc.js

  /*********************************************
   * メイン
   *********************************************/
  "use strict";

  const blogPage = new BlogPage();
  const doc  = blogPage.doc;
  const stoc = new SidebarToc(doc); // 目次モジュール

  const delay = stoc.delay;
  const m = `%c---sidebar toc---  delay.afterDomLoaded: ${delay.afterDomLoaded}`;
  console.log(m, "color:blue");
  console.time("sidebarToc is added");

  // ページの種類を判定
  let pageCategory = blogPage.getCategory();

  // 表示自体不要なら「非表示」にして処理終了
  let canContinue = stoc.hide(!pageCategory.canDisplay);
  if (!canContinue) return; // 終了

  // 目次記法の目次にもスムーズスクロールを適用
  const canListUpPages = pageCategory.canListUpPages;
  const elmMainInner   = blogPage.element.mainInner;

  let hasTocOnBody = false;
  if (!canListUpPages) hasTocOnBody = setSmoothScrollTocOnBody(elmMainInner);

  // タッチデバイスで動かさない設定の時は、「非表示」にして終了
  canContinue = stoc.hide(stoc.touch.isDisable);
  if (!canContinue) return; // 終了

  // 見出しリストを作成
  stoc.getHeadLineSources(blogPage, canListUpPages);
  stoc.generateHeadingList(hasTocOnBody, canListUpPages);

  // モジュールタイトルの追加
  const pageListTitle = pageCategory.title;
  let sidebarTocTitle = stoc.getModuleTitle(pageListTitle, canListUpPages, blogPage);

  // // 最初に設定されているタイトルを削除
  const classDefs = blogPage.selector.class;
  const clsModuleTitle   = classDefs.moduleTitle;
  const elmSidebarModule = stoc.module.element;
  const elmModuleTitles  = elmSidebarModule.getElementsByClassName(clsModuleTitle);
  const elmModuleTitle   = elmModuleTitles[0];
  if (elmModuleTitle) elmSidebarModule.removeChild(elmModuleTitle);

  let elmStocTitle = setModuleTitle(
    sidebarTocTitle, blogPage, stoc, elmSidebarModule
  );

  // module-bodyにIDを設定
  const stocIds = stoc.ids;
  stoc.module.elementBody.id = stoc.ids.body;

  // 目次本体の追加
  const ol     = doc.createElement("ol");
  ol.innerHTML = stoc.headlines.join("");

  let elmStoc = stoc.element.main;
  stoc.element.main.appendChild(ol);

  elmSidebarModule.setAttribute("id", stocIds.module);
  console.log("%c--add toc--", "color:blue");

  // a要素一覧の取得とスムーズスクロールの設定
  const elmStocAnchors = elmStoc.getElementsByTagName("a");
  const clsSidebarTocAnchors = [];
  for (let i = 0; i < elmStocAnchors.length; i++) {
    elmStocAnchors[i].addEventListener("click", clickEvent, false);
    clsSidebarTocAnchors[i] = elmStocAnchors[i].classList;
  }


  // 未使用
  const pageCategories = blogPage.categories;


}

/**
 * ページ内容に沿ったモジュール名を付与する
 *
 * @param {string}     sidebarTocTitle 
 * @param {BlogPage}   blogPage 
 * @param {SidebarToc} stoc 
 * @param {Element}    elmSidebarModule 
 */
const setModuleTitle = (sidebarTocTitle, blogPage, stoc, elmSidebarModule) => {
  if (!sidebarTocTitle) return;

  const htmlOps   = new HtmlOps();
  const title     = htmlOps.escape(sidebarTocTitle);
  const titleDiv  = htmlOps.addDiv(blogPage.doc);
  const classDefs = blogPage.selector.class;
  titleDiv.id        = stoc.ids.title;
  titleDiv.className = classDefs.moduleTitle;

  // リンクとスムーズスクロールも追加
  const canLinkTitle = stoc.link.canLinkModuleTitle;
  titleDiv.innerHTML = canLinkTitle ? `<a href="#">${title}</a>` : title;

  let elmStocTitle = false;
  elmStocTitle     = elmSidebarModule.insertBefore(
    titleDiv,
    elmSidebarModule.firstElementChild
  );

  // ページの頂点に移動
  setScrollToTop(canLinkTitle, stoc, blogPage.window, elmStocTitle);

  return elmStocTitle;
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

  const hash   = decodeURIComponent(e.currentTarget.hash);
  const target = scrollTopJs(doc.getElementById(hash.substr(1)))
               - ghFixedHeight + scroll.reactionTime;

  if (scroll.isSmooth) {
    smoothScrollY(Math.min(target, scrollRange), scroll.time);

  } else {
    win.scrollTo(win.pageXOffset, target);
    if (stoc.link.canLinkModuleTitle) win.history.pushState(null, hash, hash);

  }
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
export { index };
