const Koa = require('koa');
const db = require('diskdb');
const cors = require('koa2-cors');
const Router = require('koa-router');

const app = new Koa();
app.use(cors());
const router = new Router();

router.get('/getGoods', (ctx, next) => {
  // ctx.router available
  let {currentPage, pageSize, filter} = ctx.request.query
  db.connect('db', ['goods']);
  console.log(filter)
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