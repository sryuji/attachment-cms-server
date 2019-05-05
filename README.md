
## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

### Debug
nodemonによるdebug modeで起動され、
chrome devtoolやvscodeでremote接続して、debugging

```bash
# debug
$ yarn run start:debug
```

* 起動後、vscode debuggerの"Node: attach Nodemon debug"でvscodeからデバッグ可能
    + launch.jsonで定義されている

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

* 必要なcodeのimport宣言は必要
* top-level awaitには未対応
    + node v10より上にする必要がある
    + ts-nodeも未対応 https://github.com/TypeStrong/ts-node/issues/245


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

entityとの差分をmigrationファイルとして生成

```bash
$ yarn run orm:generate -n [migration base filename]
```

migrationの差分実行

```bash
$ yarn run orm:migrate
```

ただし、`orm:generate`では外部キーなど巧く考慮されてないケースもあるため、
初回リリースを過ぎたら、下記のmigration APIで逐次書いていくのが望ましい

[migration API](https://typeorm.io/#/migrations/using-migration-api-to-write-migrations)


## Coding rules

* eslint (for typescript)
* prettier

### 自動チェックが難しいチェックポイント

* `await` 漏れはないか？
* `transaction`の範囲の間違いはないか？
* entityにNull/Unique Constraintの漏れはないか？
* responseでさらしては駄目な値がさらされてはないか?
    + controllerのreturn時にinstance化されている値は、`class-transformer`で`@Expose`/`@Exclude`される
    + そのため、`lazy` loadで後から取得される値については、class-transformerの処理がされないので注意
        + 故に子entityを事前取得し、`BaseSerializer.serializer`時にsetする構成にしている
    + また、instanceでなくobjectとして渡した値も`class-transformer`で処理されない
* formで受け取っては駄目な値を受け取っていないか？
    + whitelistの機能でしない限り強制Bindできないようにはされている
