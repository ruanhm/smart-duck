const commons = require('../lib/commons');

let getBizs=async (ctx, next)=>{
    ctx.response.body = await commons.getBizs(ctx.query.BizType);
}
let getBiz=async (ctx, next)=>{
    ctx.response.body = await commons.getBiz(ctx.query.BizName);
}
module.exports = {
    get:new Set([getBizs,getBiz])
}