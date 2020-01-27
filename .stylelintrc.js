module.exports = {
    plugins: ['stylelint-scss'], //scss使うなら
    extends: [
      'stylelint-config-standard', //ベースの設定ファイル
      'stylelint-prettier/recommended',
    ],
    rules: {
    }
  };