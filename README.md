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
初回リリースを過ぎたら、下記の migration API で index など含め不足分の対応は必要となる

[migration API](https://typeorm.io/#/migrations/using-migration-api-to-write-migrations)

## generate Types

`dist/types/src`配下に web project で参照必要な d.ts ファイルを生成する

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

- eslint
- prettier

## Review point

- entity に Null/Unique Constraint の設定漏れがないか？
- response でさらしては駄目な値がさらされてはないか?

## Case Study

### Serializer, Dto に readonly は付けない

d.ts ファイルを生成した時に readonly も受け継がれるため、
web プロジェクト側で Request Object の生成時に困るため

### entity で特定の値を response しない

対象となる Entity に`@Exclude`を指定する事で Serialize 対象外とできる

```ts
  @Column({ length: 255 })
  @Exclude()
  token: string
```

### `@Exclude` されている値を response する

対象となる Entity を `extends`した class を用意し、この class に値をさらす method を定義し、
`@Expose`で property name を指定すれば良い

```ts
export class ExposedScope extends Scope {
  @Expose({ name: 'token' })
  getToken(): string {
    return this.token
  }
}
```

ただし、この class を利用させるために
下記のように serialize method で個別に この class を利用した instance を再作成し、 field に assign する
`ApplicationEntity#constructor`の機能で`new`時に値受け渡しを行っている

```ts
export class ScopeSerializer extends BaseSerializer {
  @Type(() => ExposedScope)
  scope: ExposedScope

  public serialize({ scope }: { scope: Scope }): this {
    this.scope = new ExposedScope(scope)
    return this
  }
}
```

`class-transformer`による serialize 処理注意点

- controller の return 時で instance 化されている値は`class-transformer`で処理される
- そのため、`lazy` load で後から取得される値については、class-transformer の処理がされない
- class が適用されていない object 型の property も処理対象にならない

### Controller で`@Res() res`で response 取得している場合

下記のように明示的に Response しないと、処理後に response されない

```js
res.status(HttpStatus.OK).json({})
```

https://docs.nestjs.com/controllers#library-specific-approach
