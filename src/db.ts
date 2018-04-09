import * as mongodb from 'mongodb'
import * as env from 'env-var'
import * as url from 'url'

const MONGO_URL = env.get('OPENSHIFT_MONGODB_DB_URL').asString() || env.get('MONGO_URL').asString()

let connection: mongodb.Db|null = null

/**
 * Returns high-level database details
 */
export function getDatabaseDetails () {
  if (!connection) {
    return {}
  } else {
    return {
      databaseName: connection.databaseName,
      url: getConnectionString(),
      type: 'MongoDB'
    }
  }
}

/**
 * Returns a MongoDB collection that can be used to insert, update, etc.
 */
export async function getCollection (name: string) {
  const conn = await getConnection()

  if (conn) {
    return conn.collection(name)
  }
}

/**
 * Returns a connection to the database if environment variables are configured.
 * Creates a connection to the MongoDB if one doesn't already exist.
 * Returns an existing connection if one is already created.
 */
async function getConnection () {
  if (connection) {
    return connection
  } else {
    const connString = getConnectionString()

    if (connString) {
      try {
        connection = await mongodb.connect(connString)

        return connection
      } catch (e) {
        return null
      }
    } else {
      return null
    }
  }
}

/**
 * Builds a MongoDB connection string based on environment variables
 */
function getConnectionString () {
  if (MONGO_URL) {
    return MONGO_URL
  } else {
    const dbServiceName = env.get('DATABASE_SERVICE_NAME').asString()

    if (dbServiceName) {
      const host = env.get(`${dbServiceName}_SERVICE_HOST`).required().asString()
      const port = env.get(`${dbServiceName}_SERVICE_PORT`).required().asString()
      const database = env.get(`${dbServiceName}_DATABASE`).required().asString()

      const username = env.get(`${dbServiceName}_USER`)
      const password = env.get(`${dbServiceName}_PASSWORD`)

      return url.format({
        protocol: 'mongodb:',
        slashes: true,
        hostname: host,
        port: port,
        pathname: database,
        auth: (username && password) ? `${username}:${password}` : ''
      })
    }

    return null
  }
}
