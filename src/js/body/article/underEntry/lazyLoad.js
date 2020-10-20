/**
 * lazy load
 *
 * 【参考】
 * - はてなブログでLazy Loadを使う方法！コピペで簡単に使える！｜パソコン・ブログガイド
 *   https://www.gipsyjazznyumon.com/lazy-load-for-hatenablog/
 *
 * - はてなブログでlazy loadを使う方法【写真ブログにおすすめ】 | PhotogLife
 *   https://www.photoglife.work/2019/08/676/
 *
 * 【使用ライブラリ】
 * [Name] jQuery (1.12.3)
 */
function main() {
  $('.lazy').lazyload({
    effect    : 'fadeIn',
    threshold : 200 // 表示位置の閾値（10pxの距離まで近づいたら表示する）
  });
}

/**
 * 外部から呼び出し可
 */
export { main };
