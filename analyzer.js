const db = require('diskdb');
const yaml = require('js-yaml');
const moment = require('moment');

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
let timeArray = []
for(let i=6;i>=0;i--) {
  const element = moment().subtract(i,'days').format('YYYY-MM-DD')
  if (element > '2018-07-20') {
    timeArray.push(element)
  }
}
// let date = '2018-07-23'

db.connect('db', ['hourStatistics']);

timeArray.forEach(date => {
  let dayArray = db.logs.find({date})
  const hourStatistics =  dayHours.map(h => {
    let records = dayArray.filter(d => d.hour === h)
    let value = records.length
    let hour = h
    return {date, hour, value}
  })
  db.hourStatistics.remove({date}, true);
  db.hourStatistics.save(hourStatistics)
})
