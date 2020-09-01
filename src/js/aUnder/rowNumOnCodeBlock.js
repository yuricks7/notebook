/**
 * コードブロックに行番号を追加
 *
 * 【参考】
 * 【はてなブログ】コード部分に行番号を表示するカスタマイズ - そういうのがいいブログ
 * https://souiunogaii.hatenablog.com/entry/hatenablog-codeline
 */
var codeBlocks = document.getElementsByClassName('code');

[].forEach.call(codeBlocks, function(e) {
  if (!/lang/.test(e.className)) {
      return;
  }

  var lines     = e.innerHTML.split(/\n/);
  var codeBlock = "";
  lines.forEach(function(line){
    if(line != ""){
      codeBlock += '<div class="code-line">' + line + '</div>';
    }
  })

  e.innerHTML = codeBlock;
});
