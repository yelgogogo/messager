const Koa = require('koa');
const app = new Koa();
const db = require('diskdb');

const Router = require('koa-router');
const router = new Router();

router.get('/getGoods', (ctx, next) => {
  // ctx.router available
  let {currentPage, pageSize, filter} = ctx.request.query
  db.connect('db', ['goods']);
  console.log(filter)
  filter = JSON.parse(filter)
  let finder = db.goods.find(filter)
  const total = finder.length
  const start = (currentPage - 1) * pageSize
  const end = currentPage * pageSize
  const data = finder.slice(start, end)
  ctx.body = {currentPage, pageSize, total,filter,data};
});

app
  .use(router.routes())
  .use(router.allowedMethods());

console.log('running app on 3000')
app.listen(3000);