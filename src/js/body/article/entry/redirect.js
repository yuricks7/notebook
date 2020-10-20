/*
  記事のURLを変更したときなどに新しい記事URLへリダイレクトする方法 | はてなブログカスタマイズメモ
  https://hatebu-memo.scriptlife.jp/entry/2018/01/21/url-redirect
 */

// import timeout  from "//yuricks7.github.io/notebook/src/js/inArticles/redirect.js";
// import redirect from "//yuricks7.github.io/notebook/src/js/inArticles/redirect.js";
const redirectUrl = "https://monologue.yuru-wota.com/entry/girlGroup/MusicVideos/Country-Girls/kaiteha-kesite-no-I-love-you";
timeout;
redirect;

/*
  はてなブログから引越し後のはてなブログのリダイレクト設定方法 | 羽田空港サーバー
  https://www.haneda-airport-server.com/entry/hatena-redirect#i
 */
setTimeout("redirect()", 3000); // = 3 sec

function redirect() {
  location.href = redirect_url;
}
