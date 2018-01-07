const DBHelper = require('./db-helper');

class BizParameter {
    constructor(param, paramName, paramType = 'string', isReturn, isLoop, isNull, id, default1) {
        this.param = param
        this.paramName = paramName
        this.paramType = paramType
        this.isReturn = isReturn
        this.isLoop = isLoop
        this.isNull = isNull
        this.id = id
        this.default = default1
    }
    async getDefaultList() {
        var map = new Map();
        if (!this.default && this.default.toLowerCase().indexOf('select')) {
            var dbhelper = new DBHelper();
            var rs = await dbhelper.query(this.default, 'map');
            dbhelper.close();
            for (let m of rs) {
                if (m.has('key') && m.has('value')) {
                    map.set(m.get('key'), m.get('value'));
                }
            }

        }
        else if (!this.default && this.default != '') {
            var arr = this.default.split(';');
            if (arr.length > 0) {
                for (let item of arr) {
                    let arrItem = item.split('=');
                    map.set(arrItem[0], arrItem[1]);
                }
            }
        }
        return map;
    }

}

module.exports = BizParameter;