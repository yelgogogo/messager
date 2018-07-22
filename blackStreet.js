const Koa = require('koa');
const db = require('diskdb');
const cors = require('koa2-cors');
const Router = require('koa-router');
const moment = require('moment');
const {PROP, CATEGORY} = require('./utils/enum')
const HTML = require('./echarts/hour')
const { createReadStream } = require('fs') ;

const app = new Koa();
app.use(cors());
const router = new Router();

router.get('/statistics/hour', (ctx, next) => {
  ctx.type = 'html'
  ctx.body = createReadStream('./echarts/hour.html');
  // ctx.body = HTML;
});

router.get('/getHourStatistics', (ctx, next) => {
  db.connect('db', ['hourStatistics']);
  ctx.body = db.hourStatistics.find()
})

router.get('/getGoods', (ctx, next) => {
  // ctx.router available
  let {currentPage, pageSize, filter, sorter} = ctx.request.query
  const clientIp = ctx.request.ip;
  const time = moment().format('YYYY-MM-DD HH:mm:ss');
  const date = moment().format('YYYY-MM-DD')
  const hour = moment().format('HH')
  const minute = moment().format('HH:mm')
  db.connect('db', ['logs']);
  db.logs.save({clientIp, time, date, hour, minute})
  db.connect('db', ['goods']);

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

app
  .use(router.routes())
  .use(router.allowedMethods());

console.log('running app on 3888')
app.listen(3888);