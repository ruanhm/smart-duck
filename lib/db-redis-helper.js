const redis = require("redis");
const { promisify } = require('util');


module.exports = () => {
    return new Promise((resolve, reject) => {
        const client = redis.createClient();
        client.on("error", function (err) {
            if (err) {
                client.quit();
                reject(err);
            }
        });
        client.on("connect", function () {
            resolve({
                get: promisify(client.get).bind(client),
                set: promisify(client.set).bind(client),
                lpush: promisify(client.lpush).bind(client),
                lpop: promisify(client.lpop).bind(client),
                lindex: promisify(client.lindex).bind(client),
                quit: client.quit.bind(client),
                exists: promisify(client.exists).bind(client),
                del: promisify(client.del).bind(client),
            })
        })
       
    })
}