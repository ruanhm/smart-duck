const commons = require('../lib/commons');

var getBizs=async (ctx, next)=>{
    ctx.response.body = await commons.getBizs(ctx.query.BizType);
}

module.exports = {
    get:new Set([getBizs])
}