import { client } from './data.js'
import { updateValue } from './thevalues.js'
import { updateChart, switchChartData, chart_data } from './thecharts.js'

client.on('message', (topic, message, packet) => {
  console.log("received " + message.toString() + " on " + topic)
  updateValue(topic, message.toString())
})

client.on('message', (topic, message, packet) => {
  updateChart(topic, message.toString())
})

function spanClickHandler(event){
  switchChartData(event.target.attributes.measurement.value,
                  event.target.attributes.sensor.value)
  event.stopPropagation();
  event.preventDefault();
}
var spanTags = document.querySelectorAll('.box .values span');
spanTags.forEach(function(s){
  s.addEventListener('click', spanClickHandler);
});
