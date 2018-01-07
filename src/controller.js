const fs = require('fs');
const _ = require('lodash');

function addControllers(router, dir) {
    fs.readdirSync(__dirname + '/' + dir)
        .filter((f) => {
            return f.endsWith('.js');
        })
        .forEach((f) => {
            console.log(`process controller:${f}...`);
            let mapping = require(__dirname + '/' + dir + '/' + f);
            let route = f.substring(0, f.length - 3);
            addMapping(router, mapping, route);
        })
}

/* 
    controller统一输出格式
    httpMethod:function||Set(function)
    httpMethod:get||post
    controller名字映射为对应路由
    method:调用的方法
*/
function addMapping(router, mapping, route) {
    route = '/' + route + '/';
    for (let m in mapping) {
        const httpMethod = m.toLowerCase();       
        if (router[httpMethod]) {
            if (_.isFunction(mapping[m])) {
                if (mapping[m].name.toLowerCase() == httpMethod) {
                    router[httpMethod](route, mapping[m]);
                    console.log(`register URL mapping:${httpMethod} ${route}`);
                }
                else {
                    router[httpMethod](route + mapping[m].name, mapping[m]);
                    console.log(`register URL mapping:${httpMethod} ${route}${mapping[m].name}`);

                }
            }
            else if (_.isSet(mapping[m])) {
                for (let method of mapping[m].values()) {
                    router[httpMethod](route + method.name, method);
                    console.log(`register URL mapping:${httpMethod} ${route}${method.name}`);
                }
            }
            else {
                console.log(`invalid URL: ${route}`);
            }
        }
        else {
            console.log(`invalid URL: ${route}`);
        }
    }
}

module.exports = function (router, dir) {
    let controllers_dir = dir || '../controllers'
    router = router || require('koa-router')();
    addControllers(router, controllers_dir);
    return router;
};