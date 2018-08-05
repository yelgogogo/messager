const Koa = require('koa');
const db = require('diskdb');
const cors = require('koa2-cors');
const Router = require('koa-router');
const moment = require('moment');
const {PROP, CATEGORY} = require('./utils/enum')
const { createReadStream } = require('fs') ;

const app = new Koa();
app.use(cors());
const router = new Router();

db.connect('db', ['transactions']);
db.connect('db', ['sales']);
db.connect('db', ['hourStatistics']);
db.connect('db', ['logs']);
db.connect('db', ['goods']);
db.connect('db', ['userLocked']);

const checkUser = (clientIp) => {
  let user = db.userLocked.findOne({clientIp})
  if (!user) {
    db.userLocked.save({clientIp, times:3})
    user = {clientIp, times:3}
  }
  return user.times
}

const changeUserTimes = (clientIp, num) => {
  const user = db.userLocked.findOne({clientIp})
  if (user) {
    user.times = user.times + num
    const options = {
      multi: false,
      upsert: false
    };
    const updated = db.userLocked.update({clientIp}, user, options);
  }
  return user.times
}

router.get('/statistics/hour', (ctx, next) => {
  ctx.type = 'html'
  ctx.body = createReadStream('./echarts/hour.html');
  // ctx.body = HTML;
});

router.get('/getHourStatistics', (ctx, next) => {
  ctx.body = db.hourStatistics.find()
})

router.get('/mailCount', (ctx, next) => {
  const clientIp = ctx.request.ip;
  const transactions = db.transactions.find({clientIp})
  ctx.body = transactions.length
})

router.get('/buy', (ctx, next) => {
  let query = ctx.request.query
  const clientIp = ctx.request.ip;
  let res = null
  if (checkUser(clientIp) > 0 ) {
    let finder = db.sales.findOne(query)
    if( finder && finder.status === 'SALE') {
      finder.status = 'LOCK'
      changeUserTimes(clientIp, -1)
      finder.clientIp = clientIp
      const options = {
        multi: false,
        upsert: false
      };
      const updated = db.sales.update(query, finder, options);
      db.transactions.save(finder)
      console.log(updated)
      res = finder.account
    }
  }
  ctx.body = res
})

router.get('/getGoods', (ctx, next) => {
  // ctx.router available
  let {currentPage, pageSize, filter, sorter} = ctx.request.query
  const clientIp = ctx.request.ip;
  const time = moment().format('YYYY-MM-DD HH:mm:ss');
  const date = moment().format('YYYY-MM-DD')
  const hour = moment().format('HH')
  const minute = moment().format('HH:mm')
  
  db.logs.save({clientIp, time, date, hour, minute})
  

  currentPage = currentPage ? currentPage : 1
  pageSize = pageSize ? pageSize : 20
  let filterObj = filter ? JSON.parse(filter) : {}
  let finder = db.goods.find(filterObj)
  if (filter !== '{}') {
    finder = finder.filter( i => {
      let res = true
      for(let prop in filterObj) {
        if(!i[prop]) {
          res = false
        }
      }
      return res
    })
  }
  if(sorter !== '{}') {
    let sorterObj = sorter ? JSON.parse(sorter) : {}
    finder = finder.sort( (a, b) => {
      let res = a[sorterObj.name] > b[sorterObj.name] ? 1 : -1
      if (!sorterObj.asc) {
        res = 0 - res
      }
      return res
    })
  }
  const total = finder.length
  const start = (currentPage - 1) * pageSize
  const end = currentPage * pageSize
  const data = finder.slice(start, end)
  ctx.body = {currentPage, pageSize, total,filter,data};
});

router.get('/getSales', (ctx, next) => {
  // ctx.router available
  let {currentPage, pageSize, filter, sorter} = ctx.request.query
  const clientIp = ctx.request.ip;
  const time = moment().format('YYYY-MM-DD HH:mm:ss');
  const date = moment().format('YYYY-MM-DD')
  const hour = moment().format('HH')
  const minute = moment().format('HH:mm')
  // db.connect('db', ['logs']);
  // db.logs.save({clientIp, time, date, hour, minute})

  currentPage = currentPage ? currentPage : 1
  pageSize = pageSize ? pageSize : 20
  let filterObj = filter ? JSON.parse(filter) : {}
  let finder = db.sales.find(filterObj)
  finder = finder.map(f => {
    delete f.account
    return f
  })
  if (filter !== '{}') {
    finder = finder.filter( i => {
      let res = true
      for(let prop in filterObj) {
        if(!i[prop]) {
          res = false
        }
      }
      return res
    })
  }
  if(sorter !== '{}') {
    let sorterObj = sorter ? JSON.parse(sorter) : {}
    finder = finder.sort( (a, b) => {
      let res = a[sorterObj.name] > b[sorterObj.name] ? 1 : -1
      if (!sorterObj.asc) {
        res = 0 - res
      }
      return res
    })
  }
  const total = finder.length
  const start = (currentPage - 1) * pageSize
  const end = currentPage * pageSize
  const data = finder.slice(start, end)
  ctx.body = {currentPage, pageSize, total,filter,data};
});


app
  .use(router.routes())
  .use(router.allowedMethods());

console.log('running app on 3888')
app.listen(3888);