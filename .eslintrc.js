module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },
  // 他のextendsされたルールを上書いて無効化するので順番に注意
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'typescript/prettier'],
  plugins: ['@typescript-eslint', 'prettier'],
  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'require-jsdoc': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    // importしたものを型宣言だけに利用してる場合に許可されるように設定
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { vars: 'all', args: 'none', ignoreRestSiblings: false }],
    'prettier/prettier': [
      'error',
      // eslint側にrule反映するため, prittierrcでなくこちらに記載
      {
        trailingComma: 'all',
        semi: false,
        singleQuote: true,
        tabWidth: 2,
        useTabs: false,
        printWidth: 120,
      },
      { usePrettierrc: false },
    ],
  },
}
