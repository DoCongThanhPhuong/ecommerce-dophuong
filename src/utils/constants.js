const SHOP_ROLES = {
  SHOP: '00001',
  WRITER: '00002',
  EDITOR: '00003',
  ADMIN: '00004'
}

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
}

const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  FORBIDDEN: 403,
  CONFLICT: 409
}

const REASON_STATUS_CODE = {
  OK: 'Success',
  CREATED: 'Created',
  FORBIDDEN: 'Bad Request Error',
  CONFLICT: 'Conflict Error'
}

module.exports = {
  SHOP_ROLES,
  HEADER,
  STATUS_CODE,
  REASON_STATUS_CODE
}
