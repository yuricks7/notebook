/**
 * 外部から呼び出し可
 */
export { main };

/**
 * コードブロックに行番号を追加
 *
 * 【参考】
 * 【はてなブログ】コード部分に行番号を表示するカスタマイズ - そういうのがいいブログ
 * https://souiunogaii.hatenablog.com/entry/hatenablog-codeline
 */
const main = () => {
  let codeBlocks = document.getElementsByClassName('code');

  // ノードのリストで配列ライクに`forEachメソッド`を使う
  // https://www.it-swarm-ja.tech/ja/javascript/javascript%E3%81%A7-foreachcall%EF%BC%88%EF%BC%89%E3%81%AF%E4%BD%95%E3%82%92%E3%81%97%E3%81%BE%E3%81%99%E3%81%8B%EF%BC%9F/1072215681/
  let nodeList = [];
  nodeList.forEach.call(codeBlocks, (e) => {
    // 言語の指定がなければ飛ばす
    if (!/lang/.test(e.className)) return;

    e.innerHTML = addRowNumbers(e);
  });
};

/**
 * 1行ごとに行番号付与用のクラスを追加する
 *
 * @param {object} e 元のCodeBlock要素
 *
 * @return {String} "code-line"クラスを付与し直したHTMLの文字列
 */
const addRowNumbers = (e) => {
  let codeLine = "";
  const  open_tag = '<div class="code-line">';
  const close_tag = '</div>';
  const lines   = e.innerHTML.split(/\n/); // 改行で区切り
  lines.forEach((line, i) => {
    if (i !== 0) {
      // if (line === "") return; 　　　　  // 空行は飛ばさない！
      if (i === lines.length - 1) return; // 最終行は飛ばす（<pre>が改行されている前提）
    }

    // // （空行に改行文字だけ入れたい）
    // if (line === '<span></span>' || line === '')  {
    //   codeLine += open_tag + '\n' + close_tag;

    // } else {
      codeLine += open_tag + line + close_tag;

    // }
  });

  return codeLine;
};
