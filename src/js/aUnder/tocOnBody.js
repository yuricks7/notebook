/**
 * 目次（クリックで表示/非表示）
 *
 * 【参考】
 * https://www.life-is-rpg.com/entry/2018/03/16/110000
 *
 * 【使用ライブラリ】
 * [Name] jQuery (1.9.1)
 */
$(function() {
  var $Contents = $(".table-of-contents");
  $($Contents).before(
    '目次<span class="show-area" style="color: blue;">[▼表示]</span>'
  );
  $(".show-area").click(function() {
    var $this = $(this);
    if ($Contents.css('display') == 'none') {
      $Contents.slideDown(100),
      $this.text("[▲隠す]");
    } else {
      $Contents.slideUp(100),
      $this.text("[▼表示]");
    };
  });
});
