import Chart from 'chart.js/auto'
import { formatMilli } from './formatting.js'

const measurementColors = {
  voltage: {
    borderColor: '#00f',
    backgroundColor: 'rgba(0, 0, 255, 0.3)'
  },
  current: {
    borderColor: '#107010',
    backgroundColor: 'rgba(16, 112, 16, 0.3)'
  },
  power: {
    borderColor: '#f93',
    backgroundColor: 'rgba(255, 153, 51, 0.3)'
  }
}

var chart_data = {
  labels: [...Array(60).keys()],
  'solar': {
    voltage: [],
    current: [],
    power: []
  },
  'PSU': {
    voltage: [],
    current: [],
    power: []
  },
  'Battery': {
    voltage: [],
    current: [],
    power: []
  },
  'Load': {
    voltage: [],
    current: [],
    power: []
  }
}
var chart_config = {
  animations: false,
  responsive: true,
  maintainAspectRatio: false,
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
      suggestedMin: 0
    }
  }
}
var charts = {
  'solar': new Chart(document.getElementById("solarChart"), {
    type: "line",
    options: chart_config,
    data: {
      labels: chart_data.labels,
      datasets: [{
        label: 'Power',
        fill: 'origin',
        borderColor: measurementColors.power.borderColor,
        backgroundColor: measurementColors.power.backgroundColor,
        data: chart_data["solar"].power
      }]
    }
  }),
  'PSU': new Chart(document.getElementById("psuChart"), {
    type: "line",
    options: chart_config,
    data: {
      labels: chart_data.labels,
      datasets: [{
        label: 'Power',
        fill: 'origin',
        borderColor: measurementColors.power.borderColor,
        backgroundColor: measurementColors.power.backgroundColor,
        data: chart_data["PSU"].power
      }]
    }
  }),
  'Battery': new Chart(document.getElementById("batteryChart"), {
    type: "line",
    options: chart_config,
    data: {
      labels: chart_data.labels,
      datasets: [{
        label: 'Power',
        fill: 'origin',
        borderColor: measurementColors.power.borderColor,
        backgroundColor: measurementColors.power.backgroundColor,
        data: chart_data["Battery"].power
      }]
    }
  }),
  'Load': new Chart(document.getElementById("loadChart"), {
    type: "line",
    options: chart_config,
    data: {
      labels: chart_data.labels,
      datasets: [{
        label: 'Power',
        fill: 'origin',
        borderColor: measurementColors.power.borderColor,
        backgroundColor: measurementColors.power.backgroundColor,
        data: chart_data["Load"].power
      }]
    }
  })
}

function updateLocalData(measurement, sensor, value) {
  let v = (measurement != 'voltage' ? formatMilli(value) : Number(value))
  chart_data[sensor][measurement].push(v)

  for(let m in chart_data[sensor]) {
    if(chart_data[sensor][m].length > 60)
      chart_data[sensor][m].shift()
  }
}

export function switchChartData(measurement, sensor) {
  charts[sensor].data.datasets[0].data = chart_data[sensor][measurement]
  setChartColor(measurement, sensor)
}

function setChartColor(measurement, sensor) {
  charts[sensor].data.datasets[0].borderColor = measurementColors[measurement].borderColor
  charts[sensor].data.datasets[0].backgroundColor = measurementColors[measurement].backgroundColor
}

export function updateChart(topic, value){
  let parts = topic.split('/')
  let measurement = parts[1]
  let sensor = parts[2]

  updateLocalData(measurement, sensor, value)
  charts[sensor].update()
}
