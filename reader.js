const fs = require('fs');
const yaml = require('js-yaml');
const {PROP, CATEGORY} = require('./utils/enum')
const db = require('diskdb');

const ownerArray = [
  {key:'201808',url:''},
]

db.connect('db', ['hourRecords']);
db.connect('db', ['dayRecords']);
db.connect('db', ['monthRecords']);

// const ownerArray = [{month:'sample', url:'http://bbs.impk.cc/ShowTopic-8186758-124.php?type=dyn'}]
const readFile = (ownerObj) => {
  let {key, url} = ownerObj
  fs.readFile(`./data/${key}`, 'utf8', (err, data) => {
    // console.log(data);  
    const arr = data.split('\n')
    
    db.hourRecords.remove({key}, true);
    db.dayRecords.remove({key}, true);
    db.monthRecords.remove({key}, true);


    let lastHour = ''
    let lastId = ''
    let arrHour = []
    let tempHourData = []
    
    arr.forEach(hourRecords => {
      
      const row = hourRecords.split(',')
      if(!row[0]) {
        arrHour = arrHour.concat(tempHourData)
        return
      } 
      let name = row[0]
      let id = row[1]
      let fullTime = row[2].substr(0,19)
      let year = fullTime.substr(0,4)
      let month = fullTime.substr(5,2)
      let day = fullTime.substr(8,2)
      let date = fullTime.substr(0,10)
      let hour = fullTime.substr(11,2)
      let thisHour = fullTime.substr(0,13)
      if(thisHour === lastHour) {
        let finder = tempHourData.findIndex(t => t.id === id)
        if(finder === -1) {
          let num = 1
          tempHourData.push({key, id, date, year, month, day, hour, num})
        } else {
          tempHourData[finder].num += 1
        }
        
      } else {
        lastHour = thisHour;
        if(tempHourData.length !== 0) {
          arrHour = arrHour.concat(tempHourData)
        }
        tempHourData = []
        let num = 1
        tempHourData.push({key, id, date, year, month, day, hour, num})
      }
    })

    db.hourRecords.save(arrHour)
  
    // get day data
    let lastDay = ''
    let tempDayData = []
    let arrDay = []

    arrHour.forEach(hourData => {
      let thisDay = hourData.date
      if (thisDay === lastDay) {
        let finder = tempDayData.findIndex(t => t.id === hourData.id)
        if(finder === -1) {
          const {key, id, date, year, month, day, num} = hourData
          tempDayData.push({key, id, date, year, month, day, num})
        } else {
          tempDayData[finder].num += hourData.num
        }
      } else {
        lastDay = thisDay;
        if(tempDayData.length !== 0) {
          arrDay = arrDay.concat(tempDayData)
        }
        tempDayData = []
        const {key, id, date, year, month, day, num} = hourData
        tempDayData.push({key, id, date, year, month, day, num})
      }
    })    
    if(tempDayData.length !== 0) {
      arrDay = arrDay.concat(tempDayData)
    }
    db.dayRecords.save(arrDay)

    // get month data
    let lastMonth = ''
    let tempMonthData = []
    let arrMonth = []

    arrDay.forEach(dayData => {
      let thisMonth = dayData.year + ' ' + dayData.month
      if (thisMonth === lastMonth) {
        let finder = tempMonthData.findIndex(t => t.id === dayData.id)
        if(finder === -1) {
          const {key, id, year, month, num} = dayData
          tempMonthData.push({key, id, year, month, num})
        } else {
          tempMonthData[finder].num += dayData.num
        }
      } else {
        lastMonth = thisMonth;
        if(tempMonthData.length !== 0) {
          arrMonth = arrMonth.concat(tempMonthData)
        }
        tempMonthData = []
        const {key, id, year, month, num} = dayData
        tempMonthData.push({key, id, year, month, num})
      }
    })    
    if(tempMonthData.length !== 0) {
      arrMonth = arrMonth.concat(tempMonthData)
    }
    db.monthRecords.save(arrMonth)
  })
}

ownerArray.forEach(o => {
  readFile(o);
})
