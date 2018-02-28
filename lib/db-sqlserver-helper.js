const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;
const _ = require('lodash');
const util = require('util');
const config = {
    userName: 'sa', // update me
    password: 'sa', // update me
    server: 'localhost',
    options: {
        // port: '5555',
        database: 'ccc',
        rowCollectionOnRequestCompletion: true
    }
}

/**
 * <summary>创建mssql连接</summary>
 * <param></param>
 * <returns>mssql连接</returns>
 */
function createConnection() {
    return new Promise((resolve, reject) => {
        var connection = new Connection(config);
        connection.on('connect', function (err) {
            if (err) {
                connection.close();
                reject(err);         
            }
            else {
                resolve(connection);
            }
        })
        connection.on('debug', function (message) {
            console.log(message);
        });
    })
}

/**
 * <summary>格式化tedious返回的数据 </summary>
 * <param name="data">tedious返回的数据集</param>
 * <param name="type">raw|map|obj</param>
 * <returns>原始格式|map数组|obj数组</returns>
 */
function formatData(data, type) {
    switch (type) {
        case 'raw': {
            return data;
        }
        case 'map': {
            let rs = [];
            for (let arr of data) {
                let _map = new Map();
                for (let o of arr) {
                    _map.set(o.metadata.colName, o.value)
                }
                rs.push(_map);
            }
            return rs;
        }
        case 'obj': {
            let rs = [];
            for (let arr of data) {
                let _obj = {};
                for (let o of arr) {
                    _obj[o.metadata.colName] = o.value
                }
                rs.push(_obj);
            }

            return rs;
        }
    }

}

/**
 * <summary>添加sql参数</summary>
 * <param name="request">tedious的request实例</param>
 * <param name="ps">参数格式{name:'',type:TYPES,value}</param>
 * <returns>格式[{colname:value}]</returns>
 */
function addParameters(request, ps) {
    if (ps && _.isArray(ps)) {
        for(let o of ps){
            if (!o.name) {
                throw new Error('Parameter Name Undefined');
            }
            if (!o.type) {
                throw new Error('Parameter Type Undefined');
            }
            if (o.isReturn) {
                request.addOutputParameter(o.name, o.type, typeof o.value == 'undefined' ? null : o.value);
            }
            else {
                request.addParameter(o.name, o.type, typeof o.value == 'undefined' ? null : o.value);
            }
        }        
    }
}

class DBHelper {
    constructor() {
        this.connection = null;
    }
    async getDBHelperPromise(sql, ps) {
        var p = this;
        if (!p.connection || !p.connection.loggedIn) {
            p.connection = await createConnection();
        }
        return new Promise((resolve, reject) => {
            var request = new Request(sql, function (err, rowCount, rows) {
                if (err) {
                    reject(err);
                    p.connection.close();
                }
                else {
                    resolve(formatData(rows, 'obj'));
                }

            })
            if (_.isArrayLikeObject(ps)) {
                try {
                    addParameters(request, ps);
                }
                catch (ex) {
                    reject(ex)
                }
            }
            p.connection.execSql(request);
        })
    }
    async query(sql, ps = null, type = 'obj') {
        var p = this;
        if (!_.isArrayLikeObject(ps)) {
            type = ps;
        }
        if (!p.connection || !p.connection.loggedIn) {
            p.connection = await createConnection();
        }
        var rs = await new Promise((resolve, reject) => {
            var request = new Request(sql, function (err, rowCount, rows) {
                if (err) {
                    reject(err);
                    p.connection.close();
                }
                else {
                    resolve(rows);
                }

            })
            if (_.isArrayLikeObject(ps)) {
                try {
                    addParameters(request, ps);
                }
                catch (ex) {
                    reject(ex)
                }
            }
            p.connection.execSql(request);
        })
        return formatData(rs, type);
    }
    async executeSql(sql, ps) {
        var p = this;
        if (!_.isArrayLikeObject(ps)) {
            type = ps;
        }
        if (!p.connection || !p.connection.loggedIn) {
            p.connection = await createConnection();
        }
        return await new Promise((resolve, reject) => {
            var output=new Map();
            var request = new Request(sql, function (err, rowCount, rows) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(output);
                }

            })
            if (_.isArrayLikeObject(ps)) {
                try {
                    addParameters(request, ps);
                }
                catch (ex) {
                    reject(ex)
                }
            }
            request.on('returnValue', function (parameterName, value, metadata) {
                output.set(parameterName,value);              
            });
            p.connection.execSql(request);
        })
    }
    async executeSqlTran(sql, ps) {
        var p = this;
        if (!p.connection || !p.connection.loggedIn) {
            p.connection = await createConnection();
        }
        try {
            await p.beginTransaction();
            var rs = await new Promise((resolve, reject) => {
                var request = new Request(sql, function (err, rowCount, rows) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }

                })
                if (_.isArrayLikeObject(ps)) {
                    try {
                        addParameters(request, ps);
                    }
                    catch (ex) {
                        reject(ex)
                    }
                }
                p.connection.execSql(request);

            })
            await p.commitTransaction();
        }
        catch (ex) {
            try {
                await p.rollbackTransaction();
            }
            catch (e) {

            }
            throw ex;
        }
    }
    async beginTransaction() {
        var p = this;
        if (!p.connection || !p.connection.loggedIn) {
            p.connection = await createConnection();
        }
        return new Promise((resolve, reject) => {
            p.connection.beginTransaction(function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            })
        })

    }
    async commitTransaction() {
        var p = this;
        return new Promise((resolve, reject) => {
            p.connection.commitTransaction(function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            })
        })
    }
    async rollbackTransaction() {
        var p = this;
        return new Promise((resolve, reject) => {
            p.connection.rollbackTransaction(function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            })
        })
    }
    async saveTransaction() {
        var p = this;
        return new Promise((resolve, reject) => {
            p.connection.saveTransaction(function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            })
        })
    }
    close() {
        this.connection.close();
    }
}

module.exports = DBHelper;