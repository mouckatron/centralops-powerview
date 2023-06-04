import { formatMilli } from './formatting.js'

export function updateValue(topic, value) {
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
  let query = `#${sensor} span.current`
  let span = document.querySelector(query)

  span.innerHTML = formatMilli(value)
}

function updateVoltage(sensor, value){
  let query = `#${sensor} span.voltage`
  let span = document.querySelector(query)

  span.innerHTML = Number(value).toFixed(3)
}

function updatePower(sensor, value){
  let query = `#${sensor} span.power`
  let span = document.querySelector(query)

  span.innerHTML = formatMilli(value)
}
