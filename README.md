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
- top-level await には未対応
  - node v10 より上にする必要がある
  - ts-node も未対応 https://github.com/TypeStrong/ts-node/issues/245

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

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
初回リリースを過ぎたら、下記の migration API で逐次書いていくのが望ましい

[migration API](https://typeorm.io/#/migrations/using-migration-api-to-write-migrations)

## Coding rules

- eslint
- prettier

### 自動チェックが難しいチェックポイント

- `await` 漏れはないか？
- `transaction`の範囲の間違いはないか？
- entity に Null/Unique Constraint の漏れはないか？
- response でさらしては駄目な値がさらされてはないか?
  - controller の return 時に instance 化されている値は、`class-transformer`で`@Expose`/`@Exclude`される
  - そのため、`lazy` load で後から取得される値については、class-transformer の処理がされないので注意
    - 故に子 entity を事前取得し、`BaseSerializer.serializer`時に set する構成にしている
  - また、instance でなく object として渡した値も`class-transformer`で処理されない
- form で受け取っては駄目な値を受け取っていないか？
  - whitelist の機能でしない限り強制 Bind できないようにはされている
