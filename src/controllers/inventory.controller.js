'use strict'

const { SuccessResponse } = require('~/core/success.response')
const InventoryService = require('~/services/inventory.service')

class InventoryController {
  addStock = async (req, res) => {
    new SuccessResponse({
      message: 'Add stock successfully',
      metadata: await InventoryService.addStockToInventory(req.body)
    }).send(res)
  }
}

module.exports = new InventoryController()
