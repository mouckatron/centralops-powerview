const mqtt = require('mqtt')
import Chart from 'chart.js/auto'
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
var host = window.location.host
if (process.env.NODE_ENV === 'development') {
  var host = process.env.HOST
}

// Chart setup
var chart_data = {
  'solar': {next: 0, labels: [...Array(60).keys()], points: []},
  'PSU': {next: 0, labels: [...Array(60).keys()], points: []},
  'Battery': {next: 0, labels: [...Array(60).keys()], points: []},
  'Load': {next: 0, labels: [...Array(60).keys()], points: []}
}
var chart_config = {
  animations: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: false
    }
  },
  elements: {
    point: {
      radius: 0
    },
    line: {
      tension: 0.2
    }
  },
  scales: {
    x: {
        display: false
    },
    y: {
      min: 0
    }
  }
}
var charts = {
  'solar': new Chart(document.getElementById("solarChart"), {
    type: "line",
    options: chart_config,
    data: {
      labels: chart_data["solar"].labels,
      datasets: [{
        label: 'Power',
        fill: 'origin',
        data: chart_data["solar"].points
      }]
    }
  }),
  'PSU': new Chart(document.getElementById("psuChart"), {
    type: "line",
    options: chart_config,
    data: {
      labels: chart_data["PSU"].labels,
      datasets: [{
        label: 'Power',
        fill: 'origin',
        data: chart_data["PSU"].points
      }]
    }
  }),
  'Battery': new Chart(document.getElementById("batteryChart"), {
    type: "line",
    options: chart_config,
    data: {
      labels: chart_data["Battery"].labels,
      datasets: [{
        label: 'Power',
        fill: 'origin',
        data: chart_data["Battery"].points
      }]
    }
  }),
  'Load': new Chart(document.getElementById("loadChart"), {
    type: "line",
    options: chart_config,
    data: {
      labels: chart_data["Load"].labels,
      datasets: [{
        label: 'Power',
        fill: 'origin',
        data: chart_data["Load"].points
      }]
    }
  })
}

// MQTT Client setup
const client = mqtt.connect(`ws://${host}/mqtt`, options)
client.on('connect', function(){
  console.log("Connected")
  client.subscribe('sensors/#', {})
})
client.on('error', (err) => {
  console.log('Connection error: ', err)
  client.end()
})
client.on('reconnect', () => {
  console.log('Reconnecting')
})
client.on('message', (topic, message, packet) => {
  console.log("received " + message.toString() + " on " + topic)
  updateValue(topic, message.toString())
})

function updateValue(topic, value) {
  let parts = topic.split('/')
  let measurement = parts[1]
  let sensor = parts[2]

  switch(measurement){
    case 'voltage': updateVoltage(sensor, value) ; break ;
    case 'current': updateCurrent(sensor, value) ; break ;
    case 'power': updatePower(sensor, value) ; break ;
  }
}

function updateCurrent(sensor, value){
  let query = `#${sensor} .current`
  let span = document.querySelector(query)

  span.innerHTML = formatCurrent(value)
}

function updateVoltage(sensor, value){
  let query = `#${sensor} .voltage`
  let span = document.querySelector(query)

  span.innerHTML = value
}

function updatePower(sensor, value){
  let query = `#${sensor} .power`
  let span = document.querySelector(query)
  updateChart(sensor, value)
  span.innerHTML = formatPower(value)
}

function formatCurrent(value){
  number = (Math.round(Number(value)) / 1000).toFixed(3)
  return number
}

function formatPower(value){
  number = (Math.round(Number(value)) / 1000).toFixed(3)
  return number
}

async function updateChart(sensor, value){
  chart_data[sensor].points.push((Number(value) / 1000))
  if (chart_data[sensor].points.length > 60){
    chart_data[sensor].points.shift()
  }
  charts[sensor].update()
}
