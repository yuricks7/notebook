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
function ($) {

  // 厳格モード
  // 【JavasScript】use strictとは - Qiita
  // https://qiita.com/miri4ech/items/ffcebaf593f5baa1c112
  'use strict';

  let urls = [],
      opts = {
        cache: false,
        dataType: 'xml'
      },
      p,
      url = 'https://www.yuru-wota.com/sitemap_index.xml';

  const parseSitemapXML = (url) => {
    let d = new $.Deferred;

    $.ajax( $.extend(opts, { url: url }) ).done(
      function(xml) {
        $(xml).find('sitemap').each(function () {
          urls.push($(this).find('loc').text());
        });

        d.resolve();
      }
    ).fail( () => {
      d.reject();

    });

    return d.promise();
  }

  const nextURL = () => {
    urls.shift();
    if (urls.length) findURL(urls[0]);
  }

  const findURL = (url) => {
    $.ajax( $.extend(opts, { url: url }) ).done(
      function (xml) {
        let isMatched = false;

        $(xml).find('url').each(function () {
          let $this = $(this);

          if ($this.find('loc').text() === location.href) {
            isMatched = true;
            appendLastmod($this.find('lastmod').text());
            return false;
          }
        });

        if (!isMatched) nextURL();
      }
    ).fail(function () { });
  }

  function appendLastmod(lastmod) {
    let lastDate   = lastmod.split('T');
    let $container =  $('<div></div>',   { 'class': 'lastmod' });
    $container.append($('<span></span>', { 'class': 'date-year'  }).text(lastDate[0].split('-')[0]));
    $container.append($('<span></span>', { 'class': 'hyphen'     }).text('-'));
    $container.append($('<span></span>', { 'class': 'date-month' }).text(lastDate[0].split('-')[1]));
    $container.append($('<span></span>', { 'class': 'hyphen'     }).text('-'));
    $container.append($('<span></span>', { 'class': 'date-day'   }).text(lastDate[0].split('-')[2]));

    if ($('.entry-header > .date').get(0).tagName.toLowerCase() === 'span') {
      $('.entry-title').before($container);

    } else {
      $('.entry-date').append($container);

    }
  }

  p = parseSitemapXML(url);
  p.done(function () { findURL(urls[0]) });
  p.fail(function (error) { });
};
