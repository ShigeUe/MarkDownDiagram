#MarkDownDiagram

Markdown風のテキストで、ER図やブロックダイアグラムのようなチャートを描けるツールです。

ローカルでブラウザのみで動作します。index.htmlをブラウザで開いてください。

Chrome推奨ですが、Safari,Firefoxでも動作します。タッチIFは未対応。

##機能

 - テキストでブロックを記述し、ブロック間を線で繋ぐ描画
 - ブロックをマウスでドラッグして位置を調整
 - ドラッグした位置はテキストに反映される
 - ブロックは複数行のtableとdivの2種類の要素
 - ラインはSVGのpathで描画
 - ブロックやラインは、cssで装飾できる
 - テキストのファイルへのロードセーブ機能
 - 印刷機能 (現状A4横サイズ固定)
 
###ロード/セーブについて

編集領域のテキストは、ブラウザのlocalStorageに自動保存されます。
LOAD/SAVEは、テキストをそのままファイルから読み込み、ダウンロードします。拡張子は便宜上.mdgとなっていますが、プレーンテキストです。

##書式

###ブロックの定義

```
[name] (class) <position>
```
nameはブロックのIDとして/[a-z0-9-_]+/。classはcssのためのクラス名。positionは自動的に設定される。


###ブロックの区切り線

```
---
```
複数行に区切られているとtable要素になる。

###他ブロックへのリンク

```
==>[name]
```
これ自体区切り線としても働く。ブロックの途中にある場合は、その行から線が始まる。

リンクの属性を設定

```
u<=(class)=>d[name]
```
classはリンクのSVG pathに適用されるクラス名。デフォルトのリンクはベジェ曲線だが、"S"を指定すると直線になる。
"<",">"は線の矢印を表す。両端に無くてもよい。
"u","d"の部分は、線の接続位置を表す。左が自ブロック、右が相手ブロックの指定。
"u"はブロックの上部中央、"d"は下部中央。"l"はブロックの左で、"r"は右になる。
相手のブロックの"l","r"の場合は、"l2","r1"のように接続先の行を指定することができる。

###ブロックのタイトル
table要素で有効

```
#title
```

###画像ブロック

```
[name] (image) 
![title](file "caption")
```
プリセットのクラスとして"image"をブロックのクラスに適用すると、枠なし、背景透明に設定できる。

###コメント

```
// comment
```


##カスタマイズ

css/custom.css にカスタムのスタイルを追加して使用できます。

画像はどこにあっても大丈夫ですが、imgの下に入れるとよいでしょう。

#Copyright

Copyright 2016 Wakufactory 
http://wakufactory.jp/ twitter:@wakufactory

License: MIT 
