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
   * @return {Document} divブロック追加後のdocument
   */
  addDiv (doc) {
    return doc.createElement("div");
  }

}

export { HtmlOperator }
