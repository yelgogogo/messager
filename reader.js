const fs = require('fs');
const yaml = require('js-yaml');
const {PROP, CATEGORY} = require('./utils/enum')
const db = require('diskdb');

const translator = (value) => {
  const typeTxt = value.replace(/[0-9]/g, '')
  const type = PROP[typeTxt]?PROP[typeTxt]:''
  numReg = /[0-9]+/
  const num =  numReg.exec(value) ? numReg.exec(value)[0] : 0
  let res = {}
  res[type] = num
  return res
}

const name = 'sample'

fs.readFile(`./data/${name}`, 'utf8', (err, data) => {
  // console.log(data);  
  const file = name.split('_')
  let owner = name
  const arr = data.toUpperCase().split('\n')
  let category = ''
  db.connect('db', ['goods']);
  db.goods.remove({owner}, true);
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
        db.goods.save(setGoods(owner, category, goods));
      }
    }
  })

});

const setGoods = (owner, category,goodsStr ) => {
  const text = goodsStr.trim()
  let priceReg = /\=\s*[0-9]+/
  let priceTest = priceReg.exec(text)
  let price = 0
  let comment = ''
  let propTxt = ''
  propTxt = text
  if(priceTest) {
    price = priceTest[0].replace(/\=/, '').trim()
    comment = text.substr(priceTest.index).replace(priceReg, '').trim()
    if(comment.indexOf('IST') !== -1) {
      priceUnit = 'IST'
    } else if (comment.indexOf('PG') !== -1) {
      priceUnit = 'PG'
    } else {
      priceUnit = 'IST'
    }
    propTxt = text.substr(0, priceTest.index)
  }
  let propArr = propTxt.trim().replace(/\s\s*/g,' ').split(' ')
  let prop = {}

  propArr.forEach(p => {
    const allProp = translator(p)
    prop = Object.assign(prop, allProp)
  })
  let goods = Object.assign({text, owner, category, price, priceUnit, comment}, prop)
  return goods
  
}

