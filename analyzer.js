const db = require('diskdb');
const yaml = require('js-yaml');

const dayHours = []
for(let i=23;i>=0;i--) {
  let hour = ''
  if (i.toString().length ===1) {
    hour = '0' + i.toString()
  } else {
    hour = i.toString()
  }
  dayHours.push( hour )
}
db.connect('db', ['logs']);
let date = '2018-07-23'
let dayArray = db.logs.find({date})

const hourStatistics =  dayHours.map(h => {
  let records = dayArray.filter(d => d.hour === h)
  let value = records.length
  let hour = h
  return {date, hour, value}
})
db.connect('db', ['hourStatistics']);
db.hourStatistics.remove({date}, true);
db.hourStatistics.save(hourStatistics)