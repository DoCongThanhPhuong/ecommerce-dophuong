const { init, getClients } = require('../../dbs/init.elasticsearch')

init({ ELASTICSEARCH_IS_ENABLED: true })

const esClient = getClients().elasticClient

// search document
const searchDocument = async (idxName, docType, payload) => {
  const result = await esClient.search({
    index: idxName,
    type: docType,
    body: payload
  })
  console.log('🚀 ~ searchDocument ~ result:', result?.body?.hits?.hits)
}

// add document
const addDocument = async ({ idxName, _id, docType, payload }) => {
  try {
    const newDoc = await esClient.index({
      index: idxName,
      id: _id,
      type: docType,
      body: payload
    })
    console.log('🚀 ~ addDocument ~ newDoc:', newDoc)
    return newDoc
  } catch (error) {}
}

// add document
// addDocument({
//   idxName: 'product_v001',
//   _id: '2003',
//   docType: 'product',
//   payload: {
//     title: 'Iphone 15 Pro',
//     price: 2000,
//     image: '...',
//     category: 'mobile'
//   }
// }).then((rs) => {
//   console.log(rs)
// })

// search document
// searchDocument('product_v001', 'product', { size: 20 }).then()

module.exports = { searchDocument, addDocument }
