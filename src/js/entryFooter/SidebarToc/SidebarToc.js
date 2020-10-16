// import { BlogPage } from "./BlogPage.js";
import { HtmlOperator as HtmlOps } from "./HtmlOperator.js";

class SidebarToc {

  /**
   * SidebarToc用の要素を取得する
   *
   * @param {Document} doc ページ
   *
   */
  constructor(doc) {
    this.doc = doc;

    // 目次モジュール
    const elmSidebarToc = this.getSidebarElement_("stoc");
    let elmContents;
    let elmContentTexts;
    this.element = {
      main        : elmSidebarToc,
      contents    : elmContents,
      contentTexts: elmContentTexts,
    }

    const moduleElement = elmSidebarToc.parentNode.parentNode;
    this.module = {
      element: moduleElement,
      style  : moduleElement.style,
      elementBody: elmSidebarToc.parentElement,

      size: {
        marginTop   : 10,
        marginBottom: 50,
        maxHeight: 0, // モジュールのサイズ（0で設定off）
      },

      position: {
        isStickyMode: false,
        fixedTop : 0, // "最終手段"
      },
    }

    // 出力する見出し
    this.headline = {
      tag    : "ol",
      min    : 1,
      sources: ["h3", "h4", "h5", "h6"],
    }
    this.headlines = [];

    // スクロール
    this.scroll = {
      reactionTime:  10,
      time        :   0, // 後半で使用
      timeForPc   : 200,
      timeForTouch: 200,
      isSmooth: false,
      canShowBarShadow: true,
    }

    // 追尾
    this.follow = {
      switchPoint: 40, // 現在地を切り替えるポイント
      canScrollOverBottom: true,
      stop: {
        whenNoSideBar   : true,
        whenEntrySmaller: true,
      }
    }

    // リンク
    this.link = {
      canLinkModuleTitle   : true,
      canRecordClickHistory: true,
    }

    // 待ち時間
    this.delay = {
      canWaitDomLoad : true,
      afterDomLoaded :    0,
      afterPageLoaded: 1000,
    }

    // データの更新
    this.UpdateAfterClick = {
      selectors: [],
      delayTime: 2000,
    }

    // タッチ
    this.touch = {
      device   : "ontouchstart" in window,
      isDisable: false,
    }

    // 各要素のid
    this.ids = {
      toc     : "stoc",
      module  : "stoc-module",
      title   : "stoc-title",
      body    : "stoc-body",
      guide   : "stoc-guide",
      subGuide: "stoc-sub-guide",
    }

    const touch  = this.touch;
    const scroll = this.scroll;
    scroll.time     = touch.device ? scroll.timeForTouch : scroll.timeForPc;
    scroll.isSmooth = scroll.time > 0 ? true : false;

  }

  /**
   * SidebarToc用の要素を取得する
   *
   * @param {string}   id  SidebarTocモジュールのid
   *
   * @return {Element}
   */
  getSidebarElement_(id) {
    const elem = this.doc.getElementById(id);

    if (!elem) {
      console.error("sidebarToc: 要素が見つかりません");
      return;
    }

    return elem;
  }

  /**
   * 目次要素全体を非表示にする
   */
  hide() {
    this.module.style.display = "none";

    console.log("%c---sidebar toc is hidden---", "color: blue");
  }

  /**
   * 表示する見出しの一覧を取得
   *
   * @param {BlogPage} blogPage
   * @param {object}   canListUpPages
   */
  getHeadLineSources(blogPage, canListUpPages) {
    let elmContents     = [];
    let elmContentTexts = [];
    const classNames   = ["hentry", "archive-entry"];
    const elmMainInner = blogPage.element.mainInner;

    // ページリスト
    if (canListUpPages) {
      elmContents     = this.pushHeadingElements_(elmMainInner,classNames);
      elmContentTexts = this.pushHeadingTexts_(elmMainInner, blogPage);

    // 目次
    } else {
      const headline = this.headline;
      elmContents    = elmMainInner.getElementsByClassName(classNames[0])[0]
                                   .getElementsByClassName("entry-content")[0]
                                   .querySelectorAll(headline.sources.join());

      // 見出しがn個以下なら目次を表示しない
      if (elmContents.length <= headline.min) {
        this.hide();
        return;
      }
    }

    this.element.contents     = elmContents;
    this.element.ContentTexts = elmContentTexts;
    return;
  }

  /**
   * 表示する見出しの要素(?)をまとめて取得
   *
   * @param {Element}  elmMainInner
   * @param {[string]} classNames
   *
   * @return {Element}
   */
  pushHeadingElements_(elmMainInner, classNames) {
    let elmHeadings;
    for (let i = 0; i < classNames.length; i++) {
      elmHeadings = elmMainInner.getElementsByClassName(classNames[i]);

      if (elmHeadings.length > 1) break;
    }

    return elmHeadings;
  }

  /**
   * 表示する見出しの文字列をまとめて取得
   *
   * @param {Element}  elmMainInner
   * @param {BlogPage} blogPage
   *
   * @return {Element}
   */
  pushHeadingTexts_(elmMainInner, blogPage) {
    const entryLink = blogPage.selector.class.entryLink;
    const elems     = elmMainInner.getElementsByClassName(entryLink);

    let elmHeadingTexts;
    for (let i = 0; i < elems.length; i++) {
      elmHeadingTexts[i] = elems[i].textContent;
    }

    return elmHeadingTexts;
  }

  /**
   * 見出しリストを作成
   *
   * @param {Boolean} hasTocOnBody
   * @param {Boolean} canListUpPages
   *
   * @return {Element}
   */
  generateHeadingList(hasTocOnBody, canListUpPages) {
    let headlines    = [];
    let currentLevel = 0;

    // タグの設定
    let line       = "";
    let closeLine  = "";
    let layerlevel = 0;
    const htmlOps = new HtmlOps();
    const elmContents     = this.element.contents;
    const elmContentTexts = this.element.contentTexts;
    for (let i = 0; i < elmContents.length; i++) {
      const elmContent = elmContents[i];
      const text = canListUpPages ? elmContentTexts[i] : elmContent.textContent;

      // a要素を作成
      // （目次記法がある時は、すでにIDが設定されているのでそれを使う）
      let idName;
      if (hasTocOnBody) {
        idName = elmContent.id;

      } else {
        idName = "section" + i;
        elmContent.setAttribute("id", idName);

      }

      // 階層を作成
      if (canListUpPages) continue; // 階層が必要ないページ
      layerlevel = this.getListLayer_(elmContent);

      closeLine = `<li><a href="#${idName}">${htmlOps.escape(text)}</a>`;
      line = this.getEndOfLine_(currentLevel, layerlevel) + closeLine;

      headlines.push(line);
      layerlevel = 0;
    }

    this.headlines = headlines;

  }

  /**
   * 現在地を探索
   *
   * @param {Element} elem
   *
   * @return {number} 階層
   */
  getListLayer_(elem) {
    const nodeName   = elem.nodeName.toLowerCase();
    const sourceTags = this.headline.sources;

    for (let i = 1; i < sourceTags.length; i++) {
      if (nodeName === sourceTags[i]) return i;
    }
  }

  /**
   * 見出しリストに追加
   *
   * @param {number} currentLevel
   * @param {number} layerlevel
   *
   * @return {string} HTML
   */
  getEndOfLine_(currentLevel, layerlevel) {
    let line = "";
    const tag = this.headline.tag;

    while (currentLevel < layerlevel) {
      line = `<${tag}>`;
      currentLevel++;
    }

    while (currentLevel > layerlevel) {
      line = `</${tag}></li>`;
      currentLevel--;
    }

    return line;
  }

  /**
   * モジュールタイトルの追加（設定によっては追加しない）
   *
   * @param {string}   pageListTitle 内容
   * @param {boolean}  canListUpPages 内容
   * @param {BlogPage} blogPage 内容
   *
   * @return {string} 表示用のモジュール名
   */
  getModuleTitle(pageListTitle, canListUpPages, blogPage) {
    let title = "";
    if (pageListTitle === "") return title;

    const classDefs = blogPage.selector.class;
    if ((!canListUpPages) && (pageListTitle === classDefs.entryTitle)) {
      title = elmMainInner.getElementsByClassName(classDefs.entryLink)[0]
                          .textContent;

    } else {
      title = pageListTitle;

    }

    console.log(`title: ${title}`);

    return title;
  }


}

export { SidebarToc }
