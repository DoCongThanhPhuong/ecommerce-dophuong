'use strict'

const { Client } = require('@elastic/elasticsearch')

let clients = {}

const instanceEventsListener = async (elasticClient) => {
  try {
    await elasticClient.ping()
    console.log('Connect to elasticsearch successfully')
  } catch (error) {
    console.error('Error connecting to elasticsearch', error)
  }
}

const init = ({
  ELASTICSEARCH_IS_ENABLED,
  ELASTICSEARCH_HOSTS = 'http://localhost:9200'
}) => {
  if (ELASTICSEARCH_IS_ENABLED) {
    const elasticClient = new Client({ node: ELASTICSEARCH_HOSTS })
    clients.elasticClient = elasticClient
    // handle connect error
    instanceEventsListener(elasticClient)
  }
}

const getClients = () => clients

const closeConnections = () => {}

module.exports = {
  init,
  getClients,
  closeConnections
}
