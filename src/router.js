'use strict'
const controller = require('./controller');
const Router = require('koa-router');
const router = new Router();
const DBHelper = require('../lib/db-sqlserver-helper');
const TYPES = require('tedious').TYPES;
const commons = require('../lib/commons');
const Biz = require('../lib/biz').Biz;
const BizResult = require('../lib/biz-result');
controller(router);
/* router.get('/', async (ctx, next) => {
    await ctx.render('/ind/index');

}) */

router.get('/AjaxGet/:QueryName', async (ctx, next) => {
    ctx.response.body = await commons.queryData(ctx.params.QueryName, ctx.query);
})

router.get('/AjaxGridData/:QueryName', async (ctx, next) => {
    ctx.response.body = await commons.queryGridData(ctx.params.QueryName, ctx.query);
})

router.get('/ToolsAjaxGet/:QueryName', async (ctx, next) => {
    ctx.response.body = await commons.getBizs();

})

router.get('/ToolsAjaxGridData/:QueryName', async (ctx, next) => {
    var dbHelper = new DBHelper();
    try {
        await dbHelper.beginTransaction();
        await dbHelper.executeSql(`insert into a values(1,1)`);
        await dbHelper.executeSql(`insert into c values(1,null)`);
        await dbHelper.commitTransaction();
        dbHelper.close();
    }
    catch (ex) {
        console.log(ex)
        await dbHelper.rollbackTransaction();
        dbHelper.close();
    }
})

router.post('/AjaxPost/:BizName', async (ctx, next) => {
    console.log(ctx.params.BizName)
    var a = await Biz.getBiz(ctx.params.BizName)
    var b = await a.execute(ctx.request.body)
    ctx.response.body = b
})

router.post('/ToolsAjaxPost/:BizName', async (ctx, next) => {
    ctx.response.body = ctx.url
})
module.exports = router;
