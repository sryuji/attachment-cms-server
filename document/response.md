# Case Study for Response Scheme

## entity で特定の値を response しないには？

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

## Controller で`@Res() res`で response 取得している場合によく在る失敗

下記のように明示的に Response しないと、処理後に response されない

```js
res.status(HttpStatus.OK).json({})
```

https://docs.nestjs.com/controllers#library-specific-approach
