# MJML 4

もしも、MJML 3.3.Xについて探しているのであれば、[このブランチ](https://github.com/mjmlio/mjml/tree/3.3.x)をご確認ください。

<p style="text-align: center;" >
  <a href="https://mjml.io" target="_blank">
    <img width="250"src="https://mjml.io/assets/img/litmus/mjmlbymailjet.png">

  </a>
</p>

<p style="text-align: center;" >
  <a href="https://github.com/mjmlio/mjml/actions">
    <img src="https://github.com/mjmlio/mjml/workflows/Mjml%20CI/badge.svg?branch=master" alt="github actions">
  </a>
  <a href="https://www.codacy.com/app/gbadi/mjml">
    <img src="https://api.codacy.com/project/badge/grade/575339cb861f4ff4b0dbb3f9e1759c35"/>
  </a>
</p>


<p style="text-align: center;" >
  | <b><a href="#translated-documentation">翻訳されたドキュメント</a></b>
  | <b><a href="#introduction">紹介</a></b>
  | <b><a href="#installation">インストール</a></b>
  | <b><a href="#usage">使い方</a></b>
  | <b><a href="#contribute">貢献</a></b> |
</p>

---
# 翻訳されたドキュメント

| 言語 | ドキュメントのリンク |
| :-: | :-: |
| 日本語 | [日本語ドキュメント](https://github.com/mjmlio/mjml/blob/master/readme-ja.md) |

# 紹介

`MJML`は[Mailjet](https://www.mailjet.com/)によって作成されたマークアップ言語で、レスポンシブemailをコーディングする際に生じる負担を軽減する設計がされています。そのセマンティックな構文は言語を簡単完結にし、その豊富な標準コンポーネントライブラリはあなたの開発時間とコードベースを短縮するでしょう。MJMLのオープンソースエンジンは、あなたの書いたMJMLをレスポンシブHTMLに変換します。

<p style="text-align: center;" >
  <a href="https://mjml.io" target="_blank">
    <img width="75%" src="https://cloud.githubusercontent.com/assets/6558790/12450760/ee034178-bf85-11e5-9dda-98d0c8f9f8d6.png">
  </a>
</p>


# インストール

`MJML`は`NPM`と一緒にインストールすることで、NodeJSやCommand Line Interfaceから使用できます。これらについてわからないの場合は、<a href="#使い方">使い方</a>から他の方法をご確認ください。

```bash
npm install mjml
```

# 開発

MJMLに変更を加えたり、マージリクエストを提出するといった作業をする場合は、[yarn](https://yarnpkg.com/lang/en/docs/install/)をダウンロードして、インストールすることで簡単に開発できるようにしましょう。

```bash
git clone https://github.com/mjmlio/mjml.git && cd mjml
yarn
yarn build
```

`yarn build:watch`を実行することで、コードを書きながらパッケージを再構築することもできます。

# 使い方

## オンライン

何もインストールしたくないですか？それならば、無料のオンラインエディターを使いましょう！

<p style="text-align: center;" >
  <a href="https://mjml.io/try-it-live" target="_blank"><img src="https://cloud.githubusercontent.com/assets/6558790/12195421/58a40618-b5f7-11e5-9ed3-80463874ab14.png" alt="try it live" width="75%"></a>
</p>
<br>

## アプリケーションとプラグイン

MJMLにはツールやプラグインといったエコシステムが備わっています。以下をご確認ください:
- The [MJML App](https://mjmlio.github.io/mjml-app/) (MJMLが含まれています)
- [Visual Studio Code plugin](https://github.com/mjmlio/vscode-mjml) (MJMLが含まれています)
- [Atom plugin](https://atom.io/users/mjmlio) (MJMLを別途インストールする必要があります)
- [Sublime Text plugin](https://packagecontrol.io/packages/MJML-syntax) (MJMLを別途インストールする必要があります)

その他のツールについては[コミュニティ](https://mjml.io/community)ページをご覧ください。

## Command line interface

> ファイルをコンパイルし、HTMLを`output.html`として出力します。

```bash
mjml input.mjml -o output.html
```

任意の`引数`をCLIに渡すことができます。これらは複数合わせて渡すこともできます。

引数 | 説明 | 初期値
---------|--------|--------------
`mjml -m [input]` | v3のMJMLファイルをv4の構文にマイグレートする | NA
`mjml [input] -o [output]` | 出力を[output]に書き込みます | NA
`mjml [input] -s` | 出力を`stdout`に書き込みます | NA
`mjml -w [input]` | `[input]`（ファイルまたはフォルダー）の変更を監視します | NA
`mjml [input] --config.beautify` | 出力を整えます(`true`または`false`) | true
`mjml [input] --config.minify` | 出力をminify化します(`true`または`false`) | false

設定オプションの詳細については[mjml-cli documentation](https://github.com/mjmlio/mjml/blob/master/packages/mjml-cli/README.md)をご覧ください。

## Node.js

```javascript
import mjml2html from 'mjml'

/*
  mjml文字列をコンパイルする
*/
const htmlOutput = mjml2html(`
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text>
            Hello World!
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`, options)


/*
  生成されたレスポンシブHTMLとMJMLのエラーがあれば表示します
*/
console.log(htmlOutput)
```

任意でオブジェクト形式の`オプション`を`mjml2html`関数に渡すことができます:

オプション   | 型   | 説明  | 初期値
-------------|--------|--------------|---------------
fonts  | object | 初期フォントをインポートしたHTMLを描画する | 初期フォントについては[index.js](https://github.com/mjmlio/mjml/blob/master/packages/mjml-core/src/index.js#L100-L108)をご覧ください。
keepComments | boolean | 出力されるHTMLにコメントを残すオプション | true
ignoreIncludes | boolean | mj-includesを無視するオプション | false
beautify | boolean | 出力されるHTMLを整えるオプション | false
minify | boolean | 出力されるHTMLをminify化するオプション | false
validationLevel | string | [validator](https://github.com/mjmlio/mjml/tree/master/packages/mjml-validator#validating-mjml)で利用する値: 'strict', 'soft', 'skip'  | 'soft'
filePath | string | mj-includesの相対パスに使われるファイルパス | '.'
preprocessors | array of functions | xmlのパース前に適用するプリプロセッサー。入力はjsonではなく、必ずxmlでなければなりません。関数の場合は必ず (xml: string) => string としなければなりません。 | []
juicePreserveTags | cssをインライン化する際にタグを保持する。詳しくは[mjml-cli documentation](https://github.com/mjmlio/mjml/blob/master/packages/mjml-cli/README.md)をご覧ください。 | NA
minifyOptions | htmlのminify化に関するオプション。詳しくは[mjml-cli documentation](https://github.com/mjmlio/mjml/blob/master/packages/mjml-cli/README.md)をご覧ください。 | NA
mjmlConfigPath | string | `.mjmlconfig`ファイルのパスもしくはディレクトリー(カスタムコンポーネントの場合) | `process.cwd()`
useMjmlConfigOptions | `.mjmlconfig`ファイルで`options`属性の使用を許可する | false

## クライアントサイド (ブラウザー)

```javascript
var mjml2html = require('mjml-browser')

/*
  mjml文字列をコンパイルする
*/
var htmlOutput = mjml2html(`
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text>
            Hello World!
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`, options)


/*
  生成されたレスポンシブHTMLとMJMLのエラーがあれば表示します
*/
console.log(htmlOutput)
```

## API

無料のMJML APIを利用することで、あなたのアプリケーションにMJMLを簡単に統合できます。
APIの詳細については[ここ](https://mjml.io/api)をご覧ください。

# MJML Slack

MJMLはその素晴らしいコミュニティなくしてはここまで良いものにならなかったでしょう。[コミュニティ Slack](https://join.slack.com/t/mjml/shared_invite/zt-gqmwfwmr-kPBnfuuB7wof5httaTcXxg)から、MJML'er達に会いにいきましょう。

# 貢献者

- [Maxime](https://github.com/iRyusa)
- [Nicolas](https://github.com/ngarnier)
- [Cedric](https://github.com/kmcb777)
- [Loeck](https://github.com/lohek)
- [Robin](https://github.com/robink)
- [Guillaume](https://github.com/GuillaumeBadi)
- [Meriadec](https://github.com/meriadec)
- [Arnaud](https://github.com/arnaudbreton)
- [HTeuMeuLeu](https://github.com/hteumeuleu)
- [Emmanuel Payet](https://github.com/epayet)
- [Matthieu](https://github.com/swibge)
- [Rogier](https://github.com/rogierslag)
