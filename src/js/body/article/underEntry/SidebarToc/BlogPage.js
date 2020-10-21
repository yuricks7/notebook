import { HtmlOperator } from "./HtmlOperator.js";

class BlogPage {

  /**
   * ページの操作を扱う
   */
  constructor() {

    // 目次モジュール用
    this.categories = [{
      class: "page-entry",
      title: "目次",
      canDisplay: true,
    }, {
      class: "page-index",
      title: "このページの記事一覧",
      canDisplay    : true,
      canListUpPages: true,
    }, {
      class: "page-archive",
      title: "このカテゴリーの記事一覧",
      canDisplay    : true,
      canListUpPages: true,
    }, {
      class: "page-static_page",
      title: "entry-title",
      canDisplay: false,
    }];

    // メディアクエリ
    this.mediaQuery = {
      canSet        : false,
      queryToDisplay: "(min-width: 1138px)",
    };

    this.selector = {
      id: {
        // はてな仕様
        globalHeaders: ["#globalheader-container"],
      },

      class: {
        // はてな仕様
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
      }
    }

    this.window = window;

    const doc = document;
    this.doc  = doc;

    this.element = {
      main     : doc.getElementById("main"),
      mainInner: doc.getElementById("main-inner"),
      box2     : doc.getElementById("box2"),
      globalHeaders: this.getGlobalHeaderElements_(),
    }


  }

  /**
   * グローバルのヘッダー要素の配列を取得
   *
   * @return {[Element]}
   */
  getGlobalHeaderElements_() {
    const htmlOps = new HtmlOperator();
    const globalHeaders = this.selector.id.globalHeaders;

    const elems   = [];
    for (let i = 0; i < globalHeaders.length; i++) {
      const globalHeader = globalHeaders[i];


      const globalElems  = htmlOps.getElements(this.doc, globalHeader);

      if (!globalElems[0]) {
        console.error("GLOBAL_HEADERS: %s が見つかりません", globalHeader);
        return;
      }

      elems.push(globalElems[0]);
    }

    return elems;
  }

  /**
   * 現在のページの種類を取得する
   *
   * @return {Element} ページの種類を表す要素
   */
  getCategory() {
    const categories    = this.categories;
    const bodyClassList = this.doc.body.classList;

    let category;
    for (let i = 0; i < categories.length; i++) {
      category = categories[i];

      if(!bodyClassList.contains(category.class)) continue;
      if(!category.canDisplay) break;

      console.log(`page: ${category.class}`);
      break;
    }

    return category;
  }

  /**
   * ページのトップに移動する
   *
   * @param {Event}  e
   * @param {object} scroll
   */
  moveToTop (e, scroll) {
    e.preventDefault();
    e.stopPropagation();

    if (scroll.isSmooth) {
      smoothScrollY(0, scroll.time);

    } else {
      this.window.scrollTo(win.pageXOffset, 0);

    }
  }

}

export { BlogPage }
