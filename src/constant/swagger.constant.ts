export const RESPONSE_200 = { status: 200, description: '正常' }
export const RESPONSE_201 = {
  status: 201,
  description: '正常. データ作成成功',
}
export const RESPONSE_204 = {
  status: 204,
  description: '正常. response bodyなし',
}

export const RESPONSE_400 = {
  status: 400,
  description: 'リクエストの形式が正しくありません.',
}
export const RESPONSE_401 = { status: 401, description: '認証が必要です' }
export const RESPONSE_403 = { status: 403, description: '権限がありません' }
export const RESPONSE_404 = {
  status: 404,
  description: 'URLが誤っている、もしくは、指定のデータが見つかりません。',
}
export const RESPONSE_DOUBLE_SUBMIT = {
  status: 409,
  description: '重複リクエスト',
}
export const RESPONSE_OPTIMISTIC_LOCK = {
  status: 409,
  description: '楽観的ロックエラー. データを再取得してから再度、更新手続きをしてください',
}
export const RESPONSE_422 = { status: 422, description: '入力エラー' }

export const QUERY_PAGE = {
  name: 'page',
  description: 'ページ番号',
  required: false,
  type: Number,
}
export const QUERY_PER = {
  name: 'per',
  description: '１ページあたりの件数',
  required: false,
  type: Number,
}
