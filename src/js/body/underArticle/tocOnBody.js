/**
 * 目次（クリックで表示/非表示）
 *
 * 【参考】
 * https://www.life-is-rpg.com/entry/2018/03/16/110000
 *
 * 【使用ライブラリ】
 * [Name] jQuery (1.9.1)
 */
const main = () => {
  const editableClass = "show-area";
  const btn = {
    open : "[▼表示]",
    close: "[▲隠す]",
  }

  let $Contents = $(".table-of-contents");
  const tag = {
    open : `<span class="${editableClass}" style="color: blue;">`,
    close: '</span>',
  }
  $($Contents).before('目次' + tag.open + btn.open + tag.close);

  const slideDuration = 100;
  $("." + editableClass).click(function() {
    let $this = $(this);

    // CSSを編集して切り替える
    if ($Contents.css('display') === 'none') {
      $Contents.slideDown(slideDuration),
      $this.text(btn.close);

    } else {
      $Contents.slideUp(slideDuration),
      $this.text(btn.open);

    };
  });
}

/**
 * 外部から呼び出し可
 */
export { main };
