// import { BlogPage } from "./BlogPage.js";
import { BlogPage } from "./BlogPage.js";
import { HtmlOperator as HtmlOps } from "./HtmlOperator.js";

class SidebarToc {

  /**
   * SidebarToc用の要素を取得する
   *
   * @param {Document} doc ページ
   *
   */
  constructor(doc, moduleTitleClass) {
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
    const titleElements = moduleElement.getElementsByClassName(moduleTitleClass);
    this.module = {
      element: moduleElement,
      style  : moduleElement.style,

      elements: {
        body  : elmSidebarToc.parentElement,
        titles: titleElements,
        title : titleElements[0],
      },

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
   *
   * @param {boolean} canHide
   *
   * @return {boolean} 処理続行の可否
   */
  hide(canHide) {
    if (!canHide) return true;

    this.module.style.display = "none";
    console.log("%c---sidebar toc is hidden---", "color: blue");

    return false;
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
   * @param {boolean} hasTocOnBody
   * @param {boolean} canListUpPages
   *
   * @return {Element}
   */
  generateHeadingList(hasTocOnBody, canListUpPages) {
    const htmlOps = new HtmlOps();
    const elmContents     = this.element.contents;
    const elmContentTexts = this.element.contentTexts;

    let headlines = [];
    let layer     = 0;
    for (let i = 0; i < elmContents.length; i++) {
      let   elem = elmContents[i];
      const text = canListUpPages ? elmContentTexts[i] : elem.textContent;

      // a要素の準備
      let attrs  = this.setLineAnchor_(hasTocOnBody, i, elem);
      let idName = attrs.idName;
      elem = attrs.elem;

      // 基本の文字列
      let line = `<li><a href="#${idName}">${htmlOps.escape(text)}</a>`;

      // 階層を追加
      let obj;
      if (!canListUpPages) obj = this.addListTags_(line, elem, layer);

      headlines.push(obj.line);
      layer = obj.layer; // 次の要素にも使用
    }

    this.headlines = headlines;
  }

  /**
   * a要素を設定する
   *
   * @param {boolean} hasTocOnBody 
   * @param {number}  i 
   * @param {Element} elem 
   *
   * @return {object} id名と、それを設定した要素
   */
  setLineAnchor_(hasTocOnBody, i, elem) {
    let idName;

    // 本文に目次記法がある時は、すでにIDが設定されているので流用する
    if (hasTocOnBody) {
      idName = elem.id;

    } else {
      idName = `section${i}`;
      elem.setAttribute('id', idName);

    }

    return {
      elem  : elem,
      idName: idName
    }
  }

  /**
   * 階層に合わせてタグを追加する
   *
   * @param {string}  line 
   * @param {Element} elem 
   * @param {number}  layer 
   *
   * @return {object} 生成した文字列と、現在の階層
   */
  addListTags_(line, elem, layer) {
    const tag   = this.headline.tag;
    let heading = this.getHeadingIndex_(elem);

    while (heading > layer) {
      line = `<${tag}>${line}`;
      layer++;
    }

    while (heading < layer) {
      line = `</${tag}></li>${line}`;
      layer--;
    }

    return {
      line: line,
      layer: layer
    }
  }

  /**
   * 出力する階層を取得
   *
   * @param {Element} elem
   *
   * @return {number}
   */
  getHeadingIndex_(elem) {
    const srcTags  = this.headline.sources;
    const nodeName = elem.nodeName.toLowerCase();

    let layer = 0;
    for (let i = 0; i < srcTags.length; i++) {
      if (nodeName !== srcTags[i]) continue;

      layer = i;
      break;
    }

    return layer;
  }

  /**
   * モジュールタイトルの追加（設定によっては追加しない）
   *
   * @param {string}  pageListTitle 
   * @param {boolean} canListUpPages 
   * @param {object}  classDefs      クラス名のリスト
   *
   * @return {string} 表示用のモジュール名
   */
  setModuleTitle(pageListTitle, canListUpPages, classDefs) {
    const stocModule      = this.module;
    const stocModuleElems = stocModule.elements;
    const stocModuleElem  = stocModule.element;
    const stocTitleElemOrigin = stocModuleElems.title;

    // 最初に設定されているタイトルを削除
    let newStocTitle
    = this.getModuleTitle_(pageListTitle, canListUpPages, classDefs);

    if (stocTitleElemOrigin) stocModuleElem.removeChild(stocTitleElemOrigin);

    let newStocTitleElem
    = this.addModuleTitle_(newStocTitle, stocModuleElem, this.doc, classDefs);

    return newStocTitleElem;
  }

  /**
   * モジュールタイトルの追加（設定によっては追加しない）
   *
   * @param {string}  pageListTitle 
   * @param {boolean} canListUpPages 
   * @param {object}  classDefs      クラス名のリスト
   *
   * @return {string} 表示用のモジュール名
   */
  getModuleTitle_(pageListTitle, canListUpPages, classDefs) {
    let title = "";
    if (pageListTitle === "") return title;

    // const classDefs = blogPage.selector.class;
    if ((!canListUpPages) && (pageListTitle === classDefs.entryTitle)) {
      title = elmMainInner.getElementsByClassName(classDefs.entryLink)[0]
                          .textContent;

    } else {
      title = pageListTitle;

    }

    console.log(`title: ${title}`);

    return title;
  }

  /**
   * ページ内容に沿ったモジュール名を付与する
   *
   * @param {string}   newStocTitle 
   * @param {Element}  stocModuleElem 
   * @param {Document} doc 
   * @param {object}   classDefs      クラス名のリスト
   *
   * @return {Element} モジュール名の要素
   */
  addModuleTitle_(newStocTitle, stocModuleElem, doc, classDefs) {
    if (!newStocTitle) return;

    const htmlOps   = new HtmlOps();
    const title     = htmlOps.escape(newStocTitle);
    const titleDiv  = htmlOps.addDiv(doc);
    // const classDefs = blogPage.selector.class;
    titleDiv.id        = this.ids.title;
    titleDiv.className = classDefs.moduleTitle;

    // リンクとスムーズスクロールも追加
    const canLinkTitle = this.link.canLinkModuleTitle;
    titleDiv.innerHTML = canLinkTitle ? `<a href="#">${title}</a>` : title;

    let elmStocTitle = false;
    elmStocTitle     = stocModuleElem.insertBefore(
      titleDiv,
      stocModuleElem.firstElementChild
    );

    return elmStocTitle;
  }

  /**
   * ページ内容に沿ったモジュール名を付与する
   *
   * @return {Element} モジュール名の要素
   */
  addBody() {
    const ol     = this.doc.createElement("ol");
    ol.innerHTML = this.headlines.join("");

    let elemStocBody = this.element.main;
    elemStocBody.appendChild(ol);

    return elemStocBody;
  }

  /**
   * a要素一覧を取得し、スムーズスクロールを設定する
   *
   * @param {Element}  elmStoc 
   * @param {function} reaction 
   *
   * @return {Element} elmStocAnchors
   */
  addAnchors(elmStoc, reaction) {
    const elmStocAnchors = elmStoc.getElementsByTagName("a");

    const clsStocAnchors = [];
    for (let i = 0; i < elmStocAnchors.length; i++) {
      elmStocAnchors[i].addEventListener("click", reaction, false);
      clsStocAnchors[i] = elmStocAnchors[i].classList;
    }

    return elmStocAnchors;
  }

  /**
   * スクロール可能か判別しやすいように、スクロールバーに影をつける
   *
   * @param {string} shadowClass 影用のクラス名
   */
  addShadowBar(shadowClass) {
    if (this.scroll.canShowBarShadow) this.element.main.classList.add(shadowClass);

  }

  /**
   * タッチデバイス用にクラスを追加する
   *
   * @param {string} touchClass タッチデバイス用のクラス名
   */
  addTouchClass(touchClass) {
    if (!this.touch.device) return;

    // 判定用にクラスを追加する
    this.element.main.classList.add(touchClass);
    this.module.element.classList.add(touchClass);
  }

  /**
   * "sticky"用にクラスを追加する
   *
   * @return {boolean} "sticky mode"の要否
   */
  addStickyClass() {
    const isStickyMode = false;
    if (!this.touch.device && !this.module.position.isStickyMode) return isStickyMode;

    const sticky    = positions.sticky;
    const propNames = [`-webkit-${sticky}`, sticky];

    const htmlOps  = new HtmlOperator();
    const divStyle = htmlOps.addDiv().style;

    for (let i = 0; i < propNames.length; i++) {
      divStyle.position = propNames[i];
      isStickyMode = divStyle.position.indexOf(sticky) !== -1;
      if (!isStickyMode) continue;

      this.module.element.classList.add("sticky");
      break;
    }

    return isStickyMode;
  }
}

export { SidebarToc }
