export const API_RESPONSE_200 = { status: 200, description: '正常' }
export const API_RESPONSE_201 = { status: 201, description: '正常. データ作成成功' }
export const API_RESPONSE_204 = { status: 204, description: '正常. response bodyなし' }

export const API_RESPONSE_400 = { status: 400, description: 'Requestの形式が正しくありません' }
export const API_RESPONSE_401 = { status: 401, description: '認証が必要です' }
export const API_RESPONSE_403 = { status: 403, description: '権限がありません' }
export const API_RESPONSE_422 = { status: 422, description: '入力エラー' }

export const API_QUERY_PAGE = {
  name: 'page',
  description: 'ページ番号',
  required: false,
  type: Number,
}
export const API_QUERY_PER = { name: 'per', description: '１ページあたりの件数', required: false, type: Number }
