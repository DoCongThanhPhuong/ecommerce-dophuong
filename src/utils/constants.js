const SHOP_ROLES = {
  SHOP: '00001',
  WRITER: '00002',
  EDITOR: '00003',
  ADMIN: '00004'
}

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESHTOKEN: 'x-rtoken-id'
}

const API_KEY_PERMISSIONS = ['0000', '1111', '2222']

const PRODUCT_TYPES = ['Electronics', 'Clothing', 'Furniture']

const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  CANCELED: 'canceled',
  DELIVERED: 'delivered'
}

const NOTIFICATION_TYPES = {
  ORDER001: 'ORDER-001',
  ORDER002: 'ORDER-002',
  PROMOTION001: 'PROMOTION-001',
  SHOP001: 'SHOP-001'
}

const CACHE_PRODUCT = {
  SKU: 'sku-k-'
}

module.exports = {
  SHOP_ROLES,
  HEADER,
  API_KEY_PERMISSIONS,
  PRODUCT_TYPES,
  ORDER_STATUS,
  NOTIFICATION_TYPES,
  CACHE_PRODUCT
}
