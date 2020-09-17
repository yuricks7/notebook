if ($('.menu').hasClass('open')) {
  var $menu = $(this).find('.menu');

  $menu.removeClass('open');
  $menu.slideUp();
  $(this).children('span').text('+');

  // openクラスを外す処理
  // 答えを隠す処理
} else {
  var $menu = $(this).find('.menu');

  $menu.addClass('open');
  $menu.slideDown();
  $(this).children('span').text('-');

  // openクラスをつける処理
  // 答えを表示する処理
}
