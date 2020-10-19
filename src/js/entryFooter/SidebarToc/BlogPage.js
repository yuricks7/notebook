class BlogPage {

  /**
   * ページの操作を扱う
   */
  constructor() {

    this.window = window;

    const doc = document;
    this.doc  = doc;

    this.element = {
      mainInner: doc.getElementById("main-inner")
    }

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
