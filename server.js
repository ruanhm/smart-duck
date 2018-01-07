'use strict'

const Koa = require('koa');
const next = require('next');
const bodyParser = require('koa-bodyparser');
const router = require('./src/router.js');
const path = require('path');
const staticCache = require('koa-static-cache');
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV == 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
app.prepare()
    .then(() => {
        const server = new Koa();
        server.use(staticCache(path.join(__dirname, 'public')));
        server.use(bodyParser());
        server.use(router.routes());
        server.use(async (ctx, next) => {
            await handle(ctx.req, ctx.res,ctx.url);
        })
        server.listen(port);
        console.log('app started at port 3000...');
    })







