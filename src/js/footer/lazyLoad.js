/**
 * lazy load
 *
 * 【参考】
 * はてなブログでLazy Loadを使う方法！コピペで簡単に使える！｜パソコン・ブログガイド
 * https://www.gipsyjazznyumon.com/lazy-load-for-hatenablog/
 *
 * 【使用ライブラリ】
 * [Name] jQuery (1.12.3)
 */
$('.lazy').lazyload({
  effect : 'fadeIn',
  threshold :200
});
