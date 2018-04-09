import { getServer } from './server'
import * as env from 'env-var'

process.on('unhandledRejection', (e) => {
  console.error(e)
})

const PORT = env.get('PORT').asIntPositive() || env.get('OPENSHIFT_NODEJS_PORT', '8080').asIntPositive()
const IP = env.get('IP').asString() || env.get('OPENSHIFT_NODEJS_IP', '0.0.0.0').asString()

getServer().listen(PORT, IP, (err) => {
  if (err) {
    console.log(new Date(), 'server failed to start listening')
    console.error(err)
    process.exit(1)
  } else {
    console.log(`server running on http://${IP}:${PORT}`)
  }
})
