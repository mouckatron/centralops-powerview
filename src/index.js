import { client } from './data.js'
import { updateValue } from './thevalues.js'
import { updateChart, switchChartData, chart_data, setDataSlots, getDataSlots } from './thecharts.js'

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

const allowable_zooms = [
  {value: 30, label: '30s'},
  {value: 60, label: '60s'},
  {value: 120, label: '2m'}, 
  {value: 180, label: '3m'}, 
  {value: 300, label: '5m'}, 
  {value: 600, label: '10m'}, 
  {value: 900, label: '15m'}, 
  {value: 1800, label: '30m'},
  {value: 3600, label: '1h'}
]
function zoom(event){
  let current_slots = getDataSlots()
  let current_zoom = allowable_zooms.findIndex((x) => x.value == current_slots)
  console.log("zooming "+event.target.id)
  console.log("current zoom " + current_zoom)

  let new_zoom = null
  if(event.target.id == "zoom-in" && current_zoom > 0){
    new_zoom = allowable_zooms[(current_zoom -1)]
  }else if(event.target.id == "zoom-out" && current_zoom < allowable_zooms.length -1){
    new_zoom = allowable_zooms[(current_zoom +1)]
  }

  if(new_zoom != null){
    setDataSlots(new_zoom.value)
    document.querySelector("#zoom-size").innerHTML = new_zoom.label
  }
}
document.querySelectorAll('#zoom-in,#zoom-out').forEach(function(el){
  el.addEventListener('click', zoom)
})
