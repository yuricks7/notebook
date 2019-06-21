# Git Commands

- [Git Commands](#git-commands)
  - [ブランチ](#%E3%83%96%E3%83%A9%E3%83%B3%E3%83%81)
    - [ブランチのリストを出力](#%E3%83%96%E3%83%A9%E3%83%B3%E3%83%81%E3%81%AE%E3%83%AA%E3%82%B9%E3%83%88%E3%82%92%E5%87%BA%E5%8A%9B)
    - [ブランチを切り替える](#%E3%83%96%E3%83%A9%E3%83%B3%E3%83%81%E3%82%92%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88%E3%82%8B)
      - [ブランチを新規作成して切り替え](#%E3%83%96%E3%83%A9%E3%83%B3%E3%83%81%E3%82%92%E6%96%B0%E8%A6%8F%E4%BD%9C%E6%88%90%E3%81%97%E3%81%A6%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88)
        - [【例】](#%E4%BE%8B)
      - [現在の変更内容を破棄して強制的に切り替え](#%E7%8F%BE%E5%9C%A8%E3%81%AE%E5%A4%89%E6%9B%B4%E5%86%85%E5%AE%B9%E3%82%92%E7%A0%B4%E6%A3%84%E3%81%97%E3%81%A6%E5%BC%B7%E5%88%B6%E7%9A%84%E3%81%AB%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88)
    - [▼参照](#%E2%96%BC%E5%8F%82%E7%85%A7)
  - [コミット](#%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88)
    - [▼基本](#%E2%96%BC%E5%9F%BA%E6%9C%AC)
    - [ファイルを指定してコミット](#%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%82%92%E6%8C%87%E5%AE%9A%E3%81%97%E3%81%A6%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88)
    - [カレントディレクトリの配下にあるファイルについて、変更をまとめてコミット](#%E3%82%AB%E3%83%AC%E3%83%B3%E3%83%88%E3%83%87%E3%82%A3%E3%83%AC%E3%82%AF%E3%83%88%E3%83%AA%E3%81%AE%E9%85%8D%E4%B8%8B%E3%81%AB%E3%81%82%E3%82%8B%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6%E5%A4%89%E6%9B%B4%E3%82%92%E3%81%BE%E3%81%A8%E3%82%81%E3%81%A6%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88)
    - [Git管理下のファイル（orインデックスに含まれるファイル）の変更をすべてコミット](#git%E7%AE%A1%E7%90%86%E4%B8%8B%E3%81%AE%E3%83%95%E3%82%A1%E3%82%A4%E3%83%ABor%E3%82%A4%E3%83%B3%E3%83%87%E3%83%83%E3%82%AF%E3%82%B9%E3%81%AB%E5%90%AB%E3%81%BE%E3%82%8C%E3%82%8B%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%81%AE%E5%A4%89%E6%9B%B4%E3%82%92%E3%81%99%E3%81%B9%E3%81%A6%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88)
    - [コメントを入力してコミット](#%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%82%92%E5%85%A5%E5%8A%9B%E3%81%97%E3%81%A6%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88)
    - [コメントに段落をつける](#%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%AB%E6%AE%B5%E8%90%BD%E3%82%92%E3%81%A4%E3%81%91%E3%82%8B)
    - [▼参照](#%E2%96%BC%E5%8F%82%E7%85%A7-1)
  - [コミットの取り消し](#%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88%E3%81%AE%E5%8F%96%E3%82%8A%E6%B6%88%E3%81%97)
    - [直前のコミットを取り消す](#%E7%9B%B4%E5%89%8D%E3%81%AE%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88%E3%82%92%E5%8F%96%E3%82%8A%E6%B6%88%E3%81%99)
      - [デフォルト（mixedモード）](#%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88mixed%E3%83%A2%E3%83%BC%E3%83%89)
      - [インデックスと作業ツリーはそのまま](#%E3%82%A4%E3%83%B3%E3%83%87%E3%83%83%E3%82%AF%E3%82%B9%E3%81%A8%E4%BD%9C%E6%A5%AD%E3%83%84%E3%83%AA%E3%83%BC%E3%81%AF%E3%81%9D%E3%81%AE%E3%81%BE%E3%81%BE)
        - [【例】](#%E4%BE%8B-1)
      - [インデックスと作業ツリーも巻き戻し](#%E3%82%A4%E3%83%B3%E3%83%87%E3%83%83%E3%82%AF%E3%82%B9%E3%81%A8%E4%BD%9C%E6%A5%AD%E3%83%84%E3%83%AA%E3%83%BC%E3%82%82%E5%B7%BB%E3%81%8D%E6%88%BB%E3%81%97)
    - [複数のコミットをまとめて取り消し](#%E8%A4%87%E6%95%B0%E3%81%AE%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88%E3%82%92%E3%81%BE%E3%81%A8%E3%82%81%E3%81%A6%E5%8F%96%E3%82%8A%E6%B6%88%E3%81%97)
    - [間違えたコミットの打ち消し用のコミットを作成](#%E9%96%93%E9%81%95%E3%81%88%E3%81%9F%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88%E3%81%AE%E6%89%93%E3%81%A1%E6%B6%88%E3%81%97%E7%94%A8%E3%81%AE%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88%E3%82%92%E4%BD%9C%E6%88%90)
    - [「取り消し」の取り消し](#%E5%8F%96%E3%82%8A%E6%B6%88%E3%81%97%E3%81%AE%E5%8F%96%E3%82%8A%E6%B6%88%E3%81%97)
      - [「打ち消しコミット」も含めた履歴の参照](#%E6%89%93%E3%81%A1%E6%B6%88%E3%81%97%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88%E3%82%82%E5%90%AB%E3%82%81%E3%81%9F%E5%B1%A5%E6%AD%B4%E3%81%AE%E5%8F%82%E7%85%A7)
      - [指定のコミットに巻き戻す](#%E6%8C%87%E5%AE%9A%E3%81%AE%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88%E3%81%AB%E5%B7%BB%E3%81%8D%E6%88%BB%E3%81%99)
        - [【例】](#%E4%BE%8B-2)
        - [【例】](#%E4%BE%8B-3)
    - [▼参照](#%E2%96%BC%E5%8F%82%E7%85%A7-2)
  - [コミットの修正](#%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88%E3%81%AE%E4%BF%AE%E6%AD%A3)
    - [直前のコミットを修正して上書き](#%E7%9B%B4%E5%89%8D%E3%81%AE%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88%E3%82%92%E4%BF%AE%E6%AD%A3%E3%81%97%E3%81%A6%E4%B8%8A%E6%9B%B8%E3%81%8D)
    - [コミットをまとめる](#%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88%E3%82%92%E3%81%BE%E3%81%A8%E3%82%81%E3%82%8B)
      - [rebase後のコンフリクトに注意！](#rebase%E5%BE%8C%E3%81%AE%E3%82%B3%E3%83%B3%E3%83%95%E3%83%AA%E3%82%AF%E3%83%88%E3%81%AB%E6%B3%A8%E6%84%8F)
    - [▼参照](#%E2%96%BC%E5%8F%82%E7%85%A7-3)
  - [プッシュ](#%E3%83%97%E3%83%83%E3%82%B7%E3%83%A5)
    - [ブランチを指定して、リモートにある同じ名前のブランチにpushする](#%E3%83%96%E3%83%A9%E3%83%B3%E3%83%81%E3%82%92%E6%8C%87%E5%AE%9A%E3%81%97%E3%81%A6%E3%83%AA%E3%83%A2%E3%83%BC%E3%83%88%E3%81%AB%E3%81%82%E3%82%8B%E5%90%8C%E3%81%98%E5%90%8D%E5%89%8D%E3%81%AE%E3%83%96%E3%83%A9%E3%83%B3%E3%83%81%E3%81%ABpush%E3%81%99%E3%82%8B)
      - [【例】](#%E4%BE%8B-4)
    - [更新するリモートのブランチ名を明示してpushする](#%E6%9B%B4%E6%96%B0%E3%81%99%E3%82%8B%E3%83%AA%E3%83%A2%E3%83%BC%E3%83%88%E3%81%AE%E3%83%96%E3%83%A9%E3%83%B3%E3%83%81%E5%90%8D%E3%82%92%E6%98%8E%E7%A4%BA%E3%81%97%E3%81%A6push%E3%81%99%E3%82%8B)
      - [【例】](#%E4%BE%8B-5)
    - [▼参照](#%E2%96%BC%E5%8F%82%E7%85%A7-4)
  - [処理の中止](#%E5%87%A6%E7%90%86%E3%81%AE%E4%B8%AD%E6%AD%A2)

## ブランチ

### ブランチのリストを出力

```shell
# オプションなし
$ git branch
```

```shell
# オプション付き
$ git branch --list
```

現在のブランチが`*`でハイライトされる。

```shell
# 結果
  branch1
  branch2
* branch3
  master
```

### ブランチを切り替える

```shell
# 入力
$ git checkout <ブランチ名>

# 結果
Switched to branch ‘<ブランチ名>’
```

#### ブランチを新規作成して切り替え

```shell
$ git checkout -b <ブランチ名>
```

##### 【例】

```shell
# 新規作成して切り替え
$ git checkout -b branch3

# 結果
Switched to a new branch ‘branch3’

# 切り替えできたか確認
$ git branch

# 結果
  branch1
  branch2
* branch3 # 現在のブランチに`*`がつく
  master
```

#### 現在の変更内容を破棄して強制的に切り替え

Gitが認識しないファイルで作業していた場合や、作業ツリーに変更があった場合など。

```shell
$ git checkout -f <ブランチ名>
Switched to branch ‘<ブランチ名>’
```

### ▼参照

- [【Git入門】チェックアウト(checkout)とは？使い方を基礎から解説！](https://www.sejuku.net/blog/71457)

## コミット

### ▼基本

`git add <file名>`でインデックス領域にステージされた変更内容をまとめてコミット

```shell
$ git commit
```

### ファイルを指定してコミット

```shell
$ git commit <ファイル名>
```

※`.gitignore`に該当するファイルはエラーになる。

```shell
# 実行
$ git commit <ファイル名>

# 結果。ファイルがステージされないため、コミットに含められない。
error: pathspec '<ファイル名>' did not match any file(s) known to git.
```

### カレントディレクトリの配下にあるファイルについて、変更をまとめてコミット

`.`を引数につける

```shell
$ git commit .
```

### Git管理下のファイル（orインデックスに含まれるファイル）の変更をすべてコミット

※**新規作成されたファイルはステージされない**ので、明示的に`git add`してからコミットする必要がある。

```shell
$ git commit --all
```

```shell
$ git commit -a
```

### コメントを入力してコミット

```shell
$ git commit . --message='<コメント>'
```

```shell
$ git commit . -m '<コメント>'
```

### コメントに段落をつける

`-m <コメント>`1つにつき1つずつ段落化される。
これを利用して、要約→詳細のように表現できる。

```shell
$ git commit . -m '<コメント>' -m '<詳細コメント>'
```

### ▼参照

- [リファレンス](https://git-scm.com/docs)
- [git commit コマンドの使い方と、主要オプションのまとめ](http://www-creators.com/archives/2106)

## コミットの取り消し

### 直前のコミットを取り消す

#### デフォルト（mixedモード）

作業ツリーはそのままで、インデックスとブランチの先頭を変更(?)。

```shell
$ git reset <ブランチ名>
```

```shell
$ git reset --mixed <ブランチ名>
```

#### インデックスと作業ツリーはそのまま

ブランチの先頭のみを変更。
=コミット先の履歴書き換えだけに留める。

```shell
$ git reset --soft <ブランチ名>
```

##### 【例】

```shell
$ git reset --soft HEAD^
```

#### インデックスと作業ツリーも巻き戻し

一つ前のコミットを**作成した直後の状態**に戻る。
=（それまでの変更も含めて）何もなかった状態にする。

```shell
$ git reset --hard <ブランチ名>
```

### 複数のコミットをまとめて取り消し

`<ブランチ名>`ではなく`<コミット識別子>`を指定すると、現在のブランチ内で特定のコミットの状態に戻せる。

```shell
$ git reset --hard <コミット識別子>
```

### 間違えたコミットの打ち消し用のコミットを作成

新しくコミットを作成するので、ブランチの過去履歴には影響を与えない。
=pushのコンフリクトを防ぐ。

```shell
$ git revert
```

```shell
$ git revert <ブランチ名>
```

mergeのコミットを打ち消す時は、注意が必要とのこと。
- [git merge の取り消し方法。reset と revert コマンドについて。](http://www-creators.com/archives/2111)

### 「取り消し」の取り消し

#### 「打ち消しコミット」も含めた履歴の参照

HEADを含め、過去の「参照」の移動遍歴を確認できる

```shell
$ git reflog
```

結果に表示される`HEAD@{xx}`が、過去何番目のHEADの状態であるかを表す。

#### 指定のコミットに巻き戻す

```shell
$ git reset --hard HEAD@{●●}
```

##### 【例】

```shell
# 入力
$ git reflog

# 結果
fc1fd0f HEAD@{0}: reset: moving to HEAD
fc1fd0f HEAD@{1}: commit: Fix the bug.
82f1826 HEAD@{2}: commit: Fix the bug.
7a52e59 HEAD@{3}: cherry-pick : Fix the layout.
ba43eb4 HEAD@{4}: commit: Fix the bug.
c57472a HEAD@{5}: commit: Add the related css props.
88e418c HEAD@{6}: commit: Narrow the margin between paragraphs
7d8611b HEAD@{7}: commit: Update the title tag.
8226a0d HEAD@{8}: commit: Add the adobe affilicate tag.

# HEAD@{5}に巻き戻し
$ git reset --hard HEAD@{5}
```

##### 【例】

### ▼参照

- [git commit を取り消して元に戻す方法、徹底まとめ](http://www-creators.com/archives/1116)
- [Basic Snapshotting > reset](https://git-scm.com/docs)
- [Patching > revert](https://git-scm.com/docs/git-revert)

## コミットの修正

### 直前のコミットを修正して上書き

直前の変更を破棄して、新しいコミットが作成される。
**識別子（SHA-1）も変更される**ことに注意！（※）

```shell
$ git commit --amend
```

```shell
$ git commit -a
```

push済みの場合、新しいコミットと（リモート側にある）古いコミット履歴とでコンフリクトが発生するので注意。
- [git commit を取り消して元に戻す方法、徹底まとめ > コミットの取り消しをリモートに反映する方法](http://www-creators.com/archives/1116#force-push)

### コミットをまとめる

現在のブランチを、<コミット>までリベース。
`<コミット>`は、コミットごとにつく半角英数字7桁の番号

```shell
$ git rebase --interactive <コミット>
```

```shell
$ git rebase -i <コミット>
```

手順は下記参照。
- [git commit を取り消して元に戻す方法、徹底まとめ > 5 過去のコミットを歴史から削除する](http://www-creators.com/archives/1116#5)

#### rebase後のコンフリクトに注意！

rebase前の履歴をすでにリモートにpush済みの場合、rebase後の履歴とコンフリクトしてしまう。

rebase後の履歴で問題ない場合は、下記のコマンドで強制的にリモートの履歴を書き換える。

```shell
# 強制的にPushする
$ git push -f origin <ブランチ名>
```

チームで開発しているときなど、**master等の複数人が参照しているブランチには、コンフリクトの原因になるので使わない**こと。

### ▼参照

- [git commit コマンドの使い方と、主要オプションのまとめ](http://www-creators.com/archives/2106)
- [git rebase -i でコミットをまとめて履歴を綺麗にしよう！](http://www-creators.com/archives/2850)
手順も図解入りで説明あり。

## プッシュ

### ブランチを指定して、リモートにある同じ名前のブランチにpushする

```shell
$ git push <リモートリポジトリ> <ローカルブランチ>
```

#### 【例】

ローカルブランチ「master」を、リモートレポジトリ「origin」上の同名のブランチに反映する

```shell
$ git push origin master
```

### 更新するリモートのブランチ名を明示してpushする

```shell
$ git push <リモートリポジトリ> <ローカルブランチ>:<リモートブランチ>
```

#### 【例】

```shell
# ローカルブランチ「master」を、リモートブランチ「master」に push
$ git push origin master:master
```

### ▼参照

- [git push コマンドの使い方と、主要オプションまとめ](http://www-creators.com/archives/1472)

## 処理の中止

Bashに`q`と入力