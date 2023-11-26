const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');

const router = new Router();
const subscribers = {};

router.get('/subscribe', async (ctx, next) => {
  const id = Math.random()
  subscribers[id] = null;

  await new Promise((resolve) => {
    const interval = setInterval(() => {
      if (subscribers[id]) {
        clearInterval(interval);
        resolve();
      }
    }, 100)
  });

  ctx.body = subscribers[id];
  ctx.status = 200;
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (message) {
    Object.keys(subscribers).forEach((id) => subscribers[id] = message)
    ctx.status = 201;
  }
});

app.use(router.routes());

module.exports = app;
