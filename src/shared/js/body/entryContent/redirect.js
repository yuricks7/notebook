/**
 *  リダイレクト
 *
 * 【参考】
 *  - 記事のURLを変更したときなどに新しい記事URLへリダイレクトする方法 | はてなブログカスタマイズメモ
 *    https://hatebu-memo.scriptlife.jp/entry/2018/01/21/url-redirect
 *  - はてなブログから引越し後のはてなブログのリダイレクト設定方法 | 羽田空港サーバー
 *    https://www.haneda-airport-server.com/entry/hatena-redirect#i
 */
function redirectTo(url) {
  setTimeout("redirect()", 3000); // = 3 sec

  function redirect() {
    location.href = url;
  }
}

export { setTimeout, redirectTo };