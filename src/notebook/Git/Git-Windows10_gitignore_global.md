# Windows10でgitignore_globalを設定

## 手順

### 【1】空のテキストファイルを作る。

| 項目 | 内容 | 備考 |
| --- | --- | --- |
| 拡張子 | `.gitignore_global.` | 末尾に`.`を付けること。<br>「拡張子を変更すると、～」のエラーは`y`を選択でok。 |
| ファイル名 | （ナシでok） | 任意のものをつけても良い。 |
| 場所 | [ホームディレクトリ](https://wa3.i-3-i.info/word11160.html) | エクスプローラーで`%HOMEPATH%`と検索するか、コマンドプロンプトで`echo %HOMEPATH%`を叩くと良い。 |

### 【2】`.gitconfig`でパスを指定する。

#### ▼ターミナル(PowerShell)で行う場合

1. `Ctrl` + `@`でターミナルを開く
2. ホームディレクトリに移動する
```ps
cd ●ホームディレクトリのパス●
```
3. 下記のコマンドを叩く。
```ps
git config --global core.excludesfile "●ホームディレクトリのフルパス●\（ファイル名）.gitignore_global"
```

- gitbashやcmdは他のコマンドで動く模様…？

#### ▼直接`.gitconfig`を編集する場合

ホームディレクトリで`.gitconfig`のファイルを探して、以下のコマンドを叩く。

以下の文を追加する。
```
[core]
  excludesfile = ●ホームディレクトリのフルパス●\\.gitignore_global
```

- フォルダは`\\`（バックスラッシュ2本）区切りが良さそう。
- （環境変数の使い方はよくわからなかった…）

### 【3】ignoreするものを記入する。

- gitignore_global用テンプレ（from Qiita）<br>
https://github.com/github/gitignore/tree/master/Global

- （参考）言語ごとの.gitignoreテンプレ<br>
https://github.com/github/gitignore

### 【4】 `.gitignore`側で除外を解除してみて、追跡されていなければOK！

## 参照

下記を参考にさせていただきました。

- [gitignore に書くべきでないものは gitignore_global へ](https://qiita.com/elzup/items/4c92a2abdab56db3fb4e) - Qiita
- [https://qiita.com/katsew/items/5cade12fa743a2f31f25](https://qiita.com/katsew/items/5cade12fa743a2f31f25) - Qiita
- [http://anton0825.hatenablog.com/entry/2015/11/01/000000](http://anton0825.hatenablog.com/entry/2015/11/01/000000) - 日々精進
- [[Git] .gitignoreの仕様詳解](https://qiita.com/anqooqie/items/110957797b3d5280c44f) - Qiita
- [Windowsエクスプローラーでドットファイルを作成する](https://qiita.com/sgur/items/745e0ee02c69b50bf9e5) - Qiita
- [ホームディレクトリ (home directory)](https://wa3.i-3-i.info/word11160.html) - 分かりそう」で「分からない」でも「分かった」気になれるIT用語辞典
