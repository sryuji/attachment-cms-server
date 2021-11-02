## Getting Started

```bash
$ nvm use
```

- nvm で node バージョンを管理していない場合、手動にて`/.nvmrc`ファイルの node バージョンに切り替えてください

```bash
$ yarn install
$ yarn run orm:migrate
$ yarn run start:dev
```

`http://localhost:3000/api-docs/` で API ドキュメントの確認できます。

また、`http://localhost:3000/api-docs-json/`で json schema をダウンロードできます。

打鍵用の seed データは下記で導入できます

```bash
$ TEST_USER_EMAIL=[お持ちのGoogleアカウント] yarn run seed:development
```

TEST_USER_EMAIL に設定した Email アドレスでログインすれば、seed で入れたデータが閲覧できます。

## Run

```bash
# development mode
$ yarn run start

# watch mode for development
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

### Debug

nodemon による debug mode で起動され、
chrome devtool や vscode で remote 接続して、debugging

```bash
# debug
$ yarn run start:debug
```

- 起動後、vscode debugger の"Node: attach Nodemon debug"で vscode からデバッグ可能
  - `/.vscode/launch.json` で定義されている vscode タスク

### REPL

```bash
# repl
$ yarn run repl
> import { Scope } from './src/db/entity/scope.entity'
> const record = new Scope()
> record.[Tab]
record.__defineGetter__      record.__defineSetter__      record.__lookupGetter__000
...
> let scope
> Scope.findOne(1).then(r => { scope = r })
Promise {
  <pending>,
...
> query: SELECT...

> scope
Scope {
...
```

- 必要な code の import 宣言は必要

## Test

下記で全てのテストが実行されます。

```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```

各テストの実行は、vscode 拡張機能の Jest で `Start All Runner`を実行した後、
各テストケースの左横に現れるマーカーから実行できます。

その他、補足

- database を必要とするテストは、in-memory sqlite を用いて実行される
- jest ではデフォルトでファイル単位に並列処理され、ファイル内は上から逐次処理される
  - database 利用時、並列処理されても Connection 単位に in-memory sqlite が作成される
  - ファイル内は上から逐次処理され、その間は database の処理結果は保持され続けるため、個別実行を配慮し必要に応じて`afterEach`で`remove` `rollback`でデータは消し込む

## migration

entity との差分を migration ファイルとして生成

```bash
$ yarn run orm:generate -n [migration base filename]
```

migration の差分実行

```bash
$ yarn run orm:migrate
```

ただし、`orm:generate`では外部キーなど巧く考慮されてないケースもあるため、
初回リリースを過ぎたら、下記の migration API で index など含め不足分の対応は必要となる

[migration API](https://typeorm.io/#/migrations/using-migration-api-to-write-migrations)

## generate Types

`dist/types/src`配下に web project で参照必要な d.ts ファイルを生成する
生成後、web プロジェクトの`types/attachment-cms-server`配下に commit する

```bash
$ yarn buildDts
```

対象ファイルは、下記

- serializer
- entity
- dto
- form

生成対象ファイルは、`tsconfig.dts.json`に定義されている

## Coding rules

### Linter

- tsconfig
- eslint
- prettier

### Other Rules

宣言

- Serializer, Dto に readonly は付けない
  - d.ts ファイルを生成した時に readonly も受け継がれ web プロジェクト側で Request Object の生成時に困るため

テストケース関連

- service, repository のテストケースは必須
- controller は基本的にテストケース不要
- dto, serializer, entity は基本的にテストケース不要
- ただし、controller はできるだけ簡素に
  - if 分岐がある場合、decorator/service/repository に処理を移譲すること. そして、そちらでテストケースを書くこと
- ただし、controller, dto, serializer 向けに個別の class-validator, class-transformer を実装した場合、その単体テストを書くこと
