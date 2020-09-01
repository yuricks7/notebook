/**
 * サイトマップから最新の更新日を取得
 *
 * 【参考】
 * 【無料はてなブログ】【カスタマイズ】更新日の表示【Minimalism】【Brooklyn】【反映されない】【時刻を消す】 - 低所得の青色申告個人事業主のブログ
 * https://account-it-dentist.hatenablog.com/entry/blog-custom003
 *
 * 【使用ライブラリ】
 * [Name] jQuery (3.3.1)
 *
 * 【作成者様のコメント】
 * 更新日時表示ちょっと手を入れてある
 * Show lastmod for Hatena Blog v1.0.1
 * Date: 2016-12-20
 * Copyright (c) 2016 https://www.tsubasa-note.blog/
 * Released under the MIT license:
 * http://opensource.org/licenses/mit-license.php
 */
(function ($) {
  'use strict';
  var urls = [],
      opts = { cache: false, dataType: 'xml' },
      p,
      url  = 'https://www.yuru-wota.com/sitemap_index.xml';

  function parseSitemapXML(url) {
    var d = new $.Deferred;

    $.ajax($.extend(opts, { url: url })).done(function (xml) {
      $(xml).find('sitemap').each(function () {
        urls.push($(this).find('loc').text());
      });
      d.resolve();

    }).fail(function () {
      d.reject();

    });
    return d.promise();
  }

  function findURL(url) {
    $.ajax($.extend(opts, { url: url })).done(function (xml) {
      var isMatched = false;
      $(xml).find('url').each(function () {
        var $this = $(this);

        if ($this.find('loc').text() === location.href) {
          isMatched = true;
          appendLastmod($this.find('lastmod').text());
          return false;
        }
      });

      if (!isMatched) nextURL();
    }).fail(function () { });
  }

  function nextURL() {
    urls.shift();
    if (urls.length) findURL(urls[0]);
  }

  function appendLastmod(lastmod) {
    var lastDate   = lastmod.split('T');
    var $container =  $('<div></div>',   { 'class': 'lastmod' });
    $container.append($('<span></span>', { 'class': 'date-year' }).text(lastDate[0].split('-')[0]));
    $container.append($('<span></span>', { 'class': 'hyphen' }).text('-'));
    $container.append($('<span></span>', { 'class': 'date-month' }).text(lastDate[0].split('-')[1]));
    $container.append($('<span></span>', { 'class': 'hyphen' }).text('-'));
    $container.append($('<span></span>', { 'class': 'date-day' }).text(lastDate[0].split('-')[2]));

    if ($('.entry-header > .date').get(0).tagName.toLowerCase() === 'span') {
      $('.entry-title').before($container);
    } else {
      $('.entry-date').append($container);
    }
  }

  p = parseSitemapXML(url);
  p.done(function () { findURL(urls[0]) });
  p.fail(function (error) { });
})(jQuery);
