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
  const tocButton = "toc-switch";
  const buttons = {
    open : '[▼表示]',
    close: '[▲隠す]',
  }

  // ボタンのデフォルト状態を設定
  let $TocBody = $(".table-of-contents");
  const tags = {
    open : `<span class="${tocButton}" style="color: blue;">`,
    close: `</span>`,
  }
  initButtonText($TocBody, buttons, tags);

  // CSSを編集して切り替える
  $("." + tocButton).click(function() {
    let $this = $(this);
    switchTocBody($this, $TocBody, buttons);
  });
}

/**
 * `display`プロパティの値からボタンの初期値を設定する
 *
 * @param {jQuery} $TocBody 
 * @param {object} buttons 
 * @param {object} tags 
 *
 * @return {jQuery} $TocBody
 */
const initButtonText = ($TocBody, buttons, tags) => {
  let text;
  if ($TocBody.css('display') === 'none') {
    text = buttons.open;

  } else {
    text = buttons.close;

  }

  return $TocBody.before(`目次${tags.open}${text}${tags.close}`);
}

/**
 * 目次の表示/非表示を切り替える
 *
 * @param {jQuery} $this 
 * @param {jQuery} $TocBody 
 * @param {object} buttons 
 */
const switchTocBody = ($this, $TocBody, buttons) => {
  const msDuration = 100;

  if ($TocBody.css('display') === 'none') {
    $TocBody.slideDown(msDuration),
    $this.text(buttons.close);

  } else {
    $TocBody.slideUp(msDuration),
    $this.text(buttons.open);

  }
}

/**
 * 外部から呼び出し可
 */
export { main };
