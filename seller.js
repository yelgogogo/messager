const fs = require('fs');
const yaml = require('js-yaml');
const {PROP, CATEGORY} = require('./utils/enum')
const db = require('diskdb');

const translator = (value) => {
  const typeTxt = value.replace(/[0-9]/g, '')
  const type = PROP[typeTxt]?PROP[typeTxt]:typeTxt
  numReg = /[0-9]+/
  let num =  numReg.exec(value) ? numReg.exec(value)[0] : ''
  if (type==='FCR' && num==='') {
    num = 10
  }
  let res = {}
  res[type] = true
  return Object.assign(res, {propArray:[{name: type, value: num}]})
}

const ownerArray = [
  {owner:'yelgogogo',url:'http://bbs.impk.cc/ShowTopic-8085318-124.php?type=dyn'},
]
// const ownerArray = [{owner:'sample', url:'http://bbs.impk.cc/ShowTopic-8186758-124.php?type=dyn'}]
const readFile = (ownerObj) => {
  let {owner, url} = ownerObj
  fs.readFile(`./data/${owner}`, 'utf8', (err, data) => {
    // console.log(data);  
    const file = owner.split('_')
    const arr = data.toUpperCase().split('\n')
    let category = ''
    db.connect('db', ['sales']);
    db.sales.remove({owner}, true);
    arr.forEach(goods => {
      goods = goods.trim()
      if (!goods) {
        category = ''
      }
      // console.log(goods)
      if (CATEGORY[goods]) {
        category = CATEGORY[goods]
      } else {      
        if (category) {
          db.sales.save(setGoods(owner, url, category, goods));
        }
      }
    })
  
  });
}

ownerArray.forEach(o => {
  readFile(o);
})

const setGoods = (owner, url, category,goodsStr ) => {
  let text = goodsStr.trim()
  let priceReg = /\=\s*[0-9]+\.{0,1}[0-9]{0,2}/
  let accReg = /\$/
  let accTest = accReg.exec(text)
  let accText = text.substr(accTest.index + 1)
  let account = JSON.parse(accText)
  text = text.substr(0,accTest.index -1)
  let priceTest = priceReg.exec(text)
  let price = 0
  let priceValue = 0
  let comment = ''
  let propTxt = ''
  propTxt = text
  if(priceTest) {
    price = parseFloat(priceTest[0].replace(/\=/, '').trim())
    comment = text.substr(priceTest.index).replace(priceReg, '').trim()
    if(comment.indexOf('IST') !== -1) {
      priceUnit = 'IST'
      priceValue = price * 40
    } else if (comment.indexOf('PG') !== -1) {
      priceUnit = 'PG'
      priceValue = price
    } else if (comment.indexOf('#') !== -1) {
      if (price < 24) {
        priceUnit = 'PG'
        price = Math.pow(2,(price - 20)) * 2.5
        priceValue = price
      } else if (price > 23){
        priceUnit = 'IST'
        price = Math.pow(2,(price - 24))
        priceValue = price * 40
      }
    } else {
      priceUnit = 'IST'
      priceValue = price * 40
    }
    propTxt = text.substr(0, priceTest.index)
  }
  // console.log(price, priceUnit)
  let propArr = propTxt.trim().replace(/\s\s*/g,' ').split(' ')
  let prop = {}
  let propArray = []
  propArr.forEach(p => {
    const allProp = translator(p)
    propArray = propArray.concat(allProp.propArray)
    delete allProp.propArray
    prop = Object.assign(prop, allProp)
  })
  let status = 'SALE'
  let goods = Object.assign({account, status, text, owner, url, category, price, priceUnit, priceValue, comment}, prop, {propArray: propArray})
  return goods
  
}

