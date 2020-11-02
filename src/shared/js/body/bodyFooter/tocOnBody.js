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
  const btnTexts = {
    open : '[▼表示]',
    close: '[▲隠す]',
  }

  // ボタンのデフォルト状態を設定
  let $TocBody = $(".table-of-contents");
  const tags = {
    open : `<span class="${tocButton}">`,
    close: `</span>`,
  }
  initButtonText($TocBody, btnTexts, tags);

  // CSSを編集して切り替える
  $("." + tocButton).click(function() {
    let $this = $(this);
    switchTocBody($this, $TocBody, btnTexts);
  });
}

/**
 * `display`プロパティの値からボタンの初期値を設定する
 *
 * @param {jQuery} $TocBody 
 * @param {object} btnTexts 
 * @param {object} tags 
 *
 * @return {jQuery} $TocBody
 */
const initButtonText = ($TocBody, btnTexts, tags) => {
  let text;
  if ($TocBody.css('display') === 'none') {
    text = btnTexts.open;

  } else {
    text = btnTexts.close;

  }

  return $TocBody.before(`目次${tags.open}${text}${tags.close}`);
}

/**
 * 目次の表示/非表示を切り替える
 *
 * @param {jQuery} $tocButton 
 * @param {jQuery} $TocBody 
 * @param {object} btnTexts 
 */
const switchTocBody = ($tocButton, $TocBody, btnTexts) => {
  const msDuration = 100;

  if ($TocBody.css('display') === 'none') {
    $TocBody.slideDown(msDuration);
    $tocButton.text(btnTexts.close);

  } else {
    $TocBody.slideUp(msDuration);
    $tocButton.text(btnTexts.open);

  }
}

/**
 * 外部から呼び出し可
 */
export { main };
