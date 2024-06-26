const { inventory } = require('../inventory.model')

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = 'unKnow'
}) => {
  return await inventory.create({
    inven_productId: productId,
    inven_location: location,
    inven_stock: stock,
    inven_shopId: shopId
  })
}

module.exports = {
  insertInventory
}
