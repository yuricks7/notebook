class HtmlOperator {
 /**
  * HTML用の記号を除去
  *
  * @return {string} 除去後の文字列
  */
 escape(str) {
    if (typeof str !== "string") return str;

    const regex = /[&'"<>]/g; // タグ関係の記号
    return str.replace(regex, this.replaceSymbols_(str));
  };

  replaceSymbols_(match) {
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
   * divブロックを追加
   *
   * @return {Element} 新しいElement
   */
  addDiv (doc) {
    return doc.createElement("div");
  }

  /**
   * 1文字目の記号からidかclass要素を取得する
   *
   * @param {Document} doc     　ページ
   * @param {string} 　idOrClass 要素の種類を表す文字列
   *
   * @return {Array} id要素かクラス要素の配列
   */
  getElements(doc, idOrClass) {
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
}

export { HtmlOperator }
