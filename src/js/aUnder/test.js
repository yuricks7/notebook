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
const main = ($) => {
  'use strict';

  let urls = [];
  let opts = { cache: false, dataType: 'xml' };

  const parseSitemapXML = (url) => {
    let d = new $.Deferred;
    $.ajax($.extend(opts, {url: url})).done(function (xml) {
      // <loc>タグの要素を順に格納
      $(xml).find('sitemap').each(function () {
        urls.push($(this).find('loc').text());
      });

      d.resolve();

    }).fail(function () {
      d.reject();

    });

    return d.promise();
  }

  const findURL = (url) => {
    $.ajax( $.extend(opts, {url: url} )).done(function (xml) {
      let isMatched = false;
      $(xml).find('url').each(function () {
        // <loc>タグの要素を取得して、リンク先（の一覧）と一致するもののみ使用する
        let $this = $(this);
        if ($this.find('loc').text() !== location.href) return;
        isMatched = true;

        // 日付を格納する
        appendLastmod($this.find('lastmod').text());

        return false;
      });

      if (!isMatched) nextURL(); // 再帰
    }).fail(function () {
    });
  }

  const nextURL = () => {
    urls.shift();
    if (urls.length) findURL(urls[0]);
  }

  const appendLastmod = (lastmod) => {
    const spanTag  = '<span></span>';
    const lastDate = lastmod.split('T');
    const dateElements = lastDate[0].split('-');

    let $container =  $('<div></div>', {'class': 'lastmod'});
    $container.append($(spanTag, {'class': 'date-year' }).text(dateElements[0]));
    $container.append($(spanTag, {'class': 'hyphen'    }).text('-'));
    $container.append($(spanTag, {'class': 'date-month'}).text(dateElements[1]));
    $container.append($(spanTag, {'class': 'hyphen'    }).text('-'));
    $container.append($(spanTag, {'class': 'date-day'  }).text(dateElements[2]));

    const position = $('.entry-header > .date').get(0).tagName.toLowerCase();
    if (position === 'span') {
      $('.entry-title').before($container);

    } else {
      $('.entry-date').append($container);

    }
  }

  let p;
  const SITEMAP = 'https://www.yuru-wota.com/sitemap_index.xml';
  p = parseSitemapXML(SITEMAP);
  p.done(function () { findURL(urls[0]) });
  p.fail(function (error) { });
}

/**
 * エントリーポイント
 */
// (main($))(jQuery);

/**
 * 外部から呼び出し可
 */
export { main };
