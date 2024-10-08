const mqtt = require('mqtt')
const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)
const options = {
  keepAlive: 60,
  clientId: clientId,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30000,
  username: 'powerview',
  password: '12345678'
}
var host = window.location.host + ":8083"
if (process.env.NODE_ENV === 'development') {
  var host = process.env.HOST // "192.168.0.140:8083" //
}

// MQTT Client setup
export const client = mqtt.connect(`ws://${host}/mqtt`, options)
client.on('connect', function(){
  console.log("Connected to", host)
  client.subscribe('sensors/#', {})
})
client.on('error', (err) => {
  console.log('Connection error: ', err)
  client.end()
})
client.on('reconnect', () => {
  console.log('Reconnecting')
})
