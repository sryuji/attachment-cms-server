
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
$ yarn run ts-node
```

* 必要なcodeのimport宣言は必要

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
$ yarn run orm migration:generate -n [migration base filename]
```
