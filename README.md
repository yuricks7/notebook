# Design CSS Customize for Hatena Blog.

- [Design CSS Customize for Hatena Blog.](#design-css-customize-for-hatena-blog)
  - [このリポジトリについて](#このリポジトリについて)
    - [GitHub Pages](#github-pages)
    - [ブログ](#ブログ)
  - [ブログ・デザイン](#ブログデザイン)
    - [デザインテーマ](#デザインテーマ)
    - [カスタマイズ適用手順メモ（Japanese Only）](#カスタマイズ適用手順メモjapanese-only)
  - [以上。](#以上)

## このリポジトリについて

このリポジトリは、ブログの下書きとカスタマイズの素材置き場です。

`en` This repogitory is darfts and resources for the Blog (Japanese Only) below.

### GitHub Pages

下記のURLにて公開しています。<br>
`en` GitHub Pages is available on the URL below.<br>

- [GitHub Pages](https://yuricks7.github.io/notebook/)

### ブログ

はてなブログにて、ブログも公開しています。<br>
良かったらご訪問ください。

`en` My Blog is available on the URL below via hatena blog.<br>
I will appreciate you if you visit.

- [Blog](https://www.yuru-wota.com/)

## ブログ・デザイン

### デザインテーマ

上記ブログでは、はてなブログのデザインテーマ<b>「Minimalism」</b>を使用しています。<br>
Minimalismについては、開発者様の説明（下記URL）をご参照ください。

`en` My Blog use the Design Theme, Minimalism for Hatena Blog.<br>
If you have a question about the theme, visit the URL below, please.

 - Custom Theme "[Minimalism](https://hitsuzi.hatenablog.com/entry/minimalism)"

### カスタマイズ適用手順メモ（Japanese Only）

※このカスタマイズは、<b>デザインCSSで「Minimalism」を適用していることを前提</b>としています。

1. このリポジトリを「GitHub Pages」として公開する（＝[このページ](#GitHub-Pages)）。

2. [はてなブログ] > [設定] > [詳細設定] > [ヘッダー]へ、下記を入力。<br>
   ※出来るだけ下の方に書いてください。<br>
  （デザインCSSだと適用されないみたいです。）

   ```html
   <link rel="stylesheet" href="//yuricks7.github.io/notebook/src/css/style.css">">
   ```

3. プレビューで見た目を確認して、問題がなければ<kbd>変更</kbd>をクリックで完了です。

## 以上。

Thank you!👋
